from typing import Any, Optional, Union

from aiogram.fsm.context import FSMContext
from pydantic import BaseModel, ValidationError

from backend.constants import TONTokenAddresses


class TokenModel(BaseModel):
    symbol: str
    address: Optional[str] = None
    amount: Optional[Union[int, float]] = None
    decimals: Optional[int] = None
    usd_rate: Optional[int] = None


class OrderModel(BaseModel):
    send_token: TokenModel
    receive_token: Optional[TokenModel] = None
    slippage: Optional[int] = 2
    minimum_to_receive: Optional[Union[int, float]] = None

    setting_up_send_token: bool = True  # a flag that shows which token the configuration processes are performed on
    warning: Optional[str] = "Select Receive Token"
    message_id: Optional[int] = None


class OrderVault:

    @staticmethod
    async def load_order(state: FSMContext) -> OrderModel:
        data = await state.get_data()

        if "order" not in data:
            data["order"] = {
                "send_token": {
                    "symbol": "TON",
                    "address": TONTokenAddresses.TON.value,
                    "amount": 5.0,
                    "decimals": 9,
                    "usd_rate": 0.0
                },
                "receive_token": None,
                "slippage": 2
            }

        order_data = data["order"]

        if isinstance(order_data.get("send_token"), dict):
            order_data["send_token"] = TokenModel(**order_data["send_token"])

        if isinstance(order_data.get("receive_token"), dict):
            order_data["receive_token"] = TokenModel(**order_data["receive_token"])

        return OrderModel(**order_data)

    async def update_order(self, state: FSMContext, **kwargs) -> None:
        order_model = await self.load_order(state)

        order_data = order_model.model_dump()

        def recursive_update(original: dict, updates: dict) -> dict:
            for key, value in updates.items():
                if (
                        isinstance(value, dict) and
                        isinstance(original.get(key), dict)
                ):
                    original[key] = recursive_update(original[key], value)
                else:
                    original[key] = value
            return original

        updated_order_data = recursive_update(order_data, kwargs)

        if isinstance(updated_order_data.get("send_token"), dict):
            updated_order_data["send_token"] = TokenModel(**updated_order_data["send_token"])

        if isinstance(updated_order_data.get("receive_token"), dict) and updated_order_data.get(
                "receive_token") is not None:
            updated_order_data["receive_token"] = TokenModel(**updated_order_data["receive_token"])

        try:
            updated_order_model = OrderModel(**updated_order_data)
        except ValidationError as e:
            print(f"Order validation error: {e}")
            return

        await state.update_data(order=updated_order_model.model_dump())


order_vault = OrderVault()
