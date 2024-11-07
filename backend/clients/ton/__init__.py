from backend.clients.ton.dedust_controller import DeDustController
from backend.clients.ton.jetton_controller import JettonController
from backend.clients.ton.limit_order_controller import LimitOrderController
from backend.clients.ton.order_task_controller import OrderTaskController
from backend.clients.ton.account_controller import AccountController
from backend.clients.ton.tonapi_client import AsyncTONApiClient

from aiogram import Bot

from backend.clients.ton.wallet import WalletManager
from backend.config import config
from backend.database.db import db


class TONController:
    """
    Class for managing TON instruments
    """
    def __init__(self, tonapi_key: str):
        self.tonapi_client = AsyncTONApiClient(tonapi_key=tonapi_key)

        self.account_controller = AccountController(self.tonapi_client)
        self.jettons_controller = JettonController(self.tonapi_client)

        self.order_task_controller = OrderTaskController()
        self.dedust_controller = DeDustController()
        self.wallet_manager = WalletManager(self.tonapi_client)

        self.limit_order_controller = LimitOrderController(
            self.tonapi_client,
            self.order_task_controller,
            self.dedust_controller,
        )

    async def async_init(self, bot: Bot) -> None:
        """
        Method for asynchronous initialization of all properties

        :return: None
        """
        await self.limit_orders.async_init(bot)
        await self.wallet_manager.init_client()
        await self.dedust.async_init()

    async def close(self) -> None:
        """
         Method for asynchronous closing all connections

        :return: None
        """
        await self.dedust.close()

    async def setup_limit_orders(self) -> None:
        orders = await db.limit_orders.get_active_orders()
        limit_orders_models = await self.limit_orders.create_limit_order_models(orders)

        # extract user ids from models
        users_ids = [order_modal.user_id for order_modal in limit_orders_models]

        # get users wallets models from db
        users_wallets = await db.ton_wallets.get_selected_wallets(users_ids)

        # save user wallets in local memory
        self.limit_orders.init_user_wallets(users_wallets)

        await self.limit_orders.launch_limit_orders(limit_orders_models)

    @property
    def order_tasks(self):
        return self.order_task_controller

    @property
    def limit_orders(self):
        return self.limit_order_controller

    @property
    def dedust(self):
        return self.dedust_controller

    @property
    def accounts(self):
        return self.account_controller

    @property
    def jettons(self):
        return self.jettons_controller

    @property
    def tonapi(self):
        return self.tonapi_client

    @property
    def wallets(self):
        return self.wallet_manager


ton = TONController(config.tonapi.key)

__all__ = [
    "ton"
]
