from backend.classes.ton.dedust_controller import DeDustController
from backend.classes.ton.jetton_controller import JettonController
from backend.classes.ton.limit_order_controller import LimitOrderController
from backend.classes.ton.order_task_controller import OrderTaskController
from backend.classes.ton.account_controller import AccountController
from backend.classes.ton.tonapi_client import AsyncTONApiClient

from aiogram import Bot

from backend.classes.ton.wallet import WalletManager
from backend.config import config


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
