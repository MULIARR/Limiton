import asyncio

from aiogram import Bot
from dedust import Asset

from backend.clients.logger_config import app_logger
from backend.constants import TONTokenAddresses
from backend.database.db import db
from backend.database.enums import OrderStatus
from backend.database.schema.order import Order
from backend.database.schema.ton_wallet import TonWallet
from backend.models.order import LimitOrderModel
from backend.models.ton_metadata import TonMetadataModel


class LimitOrderController:
    def __init__(
            self,
            tonapi,
            order_task,
            dedust
    ):
        self.tonapi = tonapi
        self.order_task = order_task
        self.dedust = dedust
        self.bot = None
        self.user_wallets: dict[int, TonWallet] = {}

    async def async_init(self, bot: Bot):
        self.bot = bot

    def init_user_wallets(self, user_wallets: list[TonWallet]) -> None:
        """
        (So bad) Local storage of user wallets so that we don't
         have to be pulled out of the db each time

        :param user_wallets:
        :return:
        """
        self.user_wallets = {wallet.user_id: wallet for wallet in user_wallets}

    async def get_user_wallet_from_storage(self, user_id: int):
        """
        Return the user's wallet from local storage
        or fetch it from the db and save if not found

        :param user_id:
        :return:
        """
        wallet = self.user_wallets.get(user_id)
        if not wallet:
            wallet = await db.ton_wallets.get_selected_wallet(user_id)
            if wallet:
                self.user_wallets[user_id] = wallet
        return wallet

    async def _fetch_and_update_metadata(self, order_data: dict) -> LimitOrderModel:
        send_token_address = order_data['send_token_address']
        receive_token_address = order_data['receive_token_address']

        send_token_metadata = (
            TonMetadataModel() if send_token_address == TONTokenAddresses.TON
            else await self.tonapi.get_jetton_metadata(send_token_address)
        )

        receive_token_metadata = (
            TonMetadataModel() if receive_token_address == TONTokenAddresses.TON
            else await self.tonapi.get_jetton_metadata(receive_token_address)
        )

        order_model = LimitOrderModel(**order_data)

        order_data['send_token_metadata'] = send_token_metadata
        order_data['receive_token_metadata'] = receive_token_metadata

        order_model.send_token_metadata = send_token_metadata
        order_model.receive_token_metadata = receive_token_metadata

        return order_model

    async def create_limit_order_model(
            self,
            order: Order
    ) -> LimitOrderModel:
        return await self._fetch_and_update_metadata(order.to_dict())

    async def create_limit_order_models(
            self,
            orders: list[Order]
    ) -> list[LimitOrderModel]:
        tasks = [self.create_limit_order_model(order_record) for order_record in orders]
        return await asyncio.gather(*tasks)

    async def launch_limit_orders(
            self,
            order_models: list[LimitOrderModel]
    ) -> None:
        for order_model in order_models:
            await self.launch_limit_order(order_model)

    async def launch_limit_order(
            self,
            order_model: LimitOrderModel
    ) -> None:
        user_wallet = await self.get_user_wallet_from_storage(order_model.user_id)

        self.order_task.create_task(
            order_id=order_model.order_id,
            coroutine=self.run_order(order_model, user_wallet.mnemonics),
            order_model=order_model
        )

    async def run_order(
            self,
            order: LimitOrderModel,
            user_mnemonics: list[str],
            jetton_vault=None,
            jetton_wallet=None
    ):
        app_logger.info(f'[LIMIT ORDER] Inited -> {order.send_amount} {order.send_token_metadata.symbol} to '
                        f'{order.receive_amount} {order.receive_token_metadata.symbol} '
                        f'(MIN: {order.minimum_to_receive_amount})')

        user_wallet = await self.dedust.get_wallet_from_mnemonics(user_mnemonics)

        [send_asset, _], pool = await self.dedust.get_pool_and_assets(
            order.send_token_address, order.receive_token_address
        )

        # other preparation of Toncoin sending
        is_ton_sending = send_asset.equals(Asset.native())

        if not is_ton_sending:
            jetton_vault, jetton_wallet = await self.dedust.get_send_jetton_objects(
                order.send_token_address, user_wallet
            )

        # prepare swap
        swap = self.dedust.prepare_swap(
            is_ton_sending=is_ton_sending,
            send_amount=order.send_amount,
            minimum_to_receive=order.minimum_to_receive_amount,
            pool=pool,
            jetton_vault=jetton_vault,
            jetton_wallet=jetton_wallet,
            recipient_address=user_wallet.address
        )

        app_logger.info(f'[LAUCNHED] #{order.order_id}')  # noqa

        while True:
            estimated_swap = await self.dedust.estimate_swap(
                send_asset=send_asset,
                send_amount=order.send_amount,
                send_asset_decimals=order.send_token_metadata.decimals,
                receive_asset_decimals=order.receive_token_metadata.decimals,
                pool=pool
            )

            # print(f"Current: {estimated_swap} Order: {order.receive_amount}")
            if estimated_swap and estimated_swap >= order.receive_amount:
                result = await self.dedust.execute_swap(
                    swap=swap,
                    send_amount=order.send_amount,
                    jetton_wallet=jetton_wallet,
                    user_wallet=user_wallet,
                    is_ton_sending=is_ton_sending
                )

                if result:
                    app_logger.info(f'[SUCCESS] Swapped #{order.order_id} {order.send_amount} {order.send_token_metadata.symbol} to {order.receive_amount} {order.receive_token_metadata.symbol}')  # noqa

                break

            await asyncio.sleep(1)

        app_logger.info('Limit Order Completed')

        # notify user
        await self.bot.send_message(
            chat_id=order.user_id,
            text=f"🚀 <b>Order Executed</b>\n\n{order.send_amount} {order.send_token_metadata.symbol} » {estimated_swap} {order.receive_token_metadata.symbol}"  # noqa
        )

        # update order status db
        await db.limit_orders.update_order_status(order.order_id, OrderStatus.COMPLETED.value)

        # stop task
        is_cancelled = self.order_task.cancel_task(order.order_id)
