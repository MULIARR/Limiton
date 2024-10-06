from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder

from backend.bot.keyboards.factory import factories


class MenuKeyboards:

    @staticmethod
    def create_wallet_generation_markup() -> InlineKeyboardMarkup:
        markup = InlineKeyboardBuilder()

        markup.row(
            InlineKeyboardButton(
                text="Generate new wallet",
                callback_data="1"
            )
        )

        return markup.as_markup()

    @staticmethod
    def create_menu_markup() -> InlineKeyboardMarkup:
        markup = InlineKeyboardBuilder()

        markup.row(
            InlineKeyboardButton(
                text="👛 Wallet",
                callback_data="user_wallet"
            )
        )

        markup.row(
            InlineKeyboardButton(
                text="Add order",
                callback_data=factories.order.creation(action="new_order").pack()
            ),
            InlineKeyboardButton(
                text="My orders",
                callback_data="user_orders"
            )
        )

        return markup.as_markup()
