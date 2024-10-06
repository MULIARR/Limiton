from aiogram import Router, Bot
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery

from backend.bot.handlers.orders.creation.menu import open_order_creation
from backend.bot.handlers.orders.creation.order_vault import order_vault
from backend.bot.keyboards import factories

slippage_router = Router()


@slippage_router.callback_query(factories.order.slippage.filter())
async def show_menu(
        query: CallbackQuery,
        bot: Bot,
        state: FSMContext,
        callback_data: factories.order.slippage,
):
    await order_vault.update_order(state, slippage=callback_data.slippage)

    await open_order_creation(bot, query.from_user.id, query.message.message_id, state)
