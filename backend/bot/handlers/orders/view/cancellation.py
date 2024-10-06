from aiogram import Router, Bot
from aiogram.types import CallbackQuery

from backend.bot.handlers.orders.view.menu import open_user_orders_menu
from backend.bot.keyboards import factories
from backend.classes import ton
from backend.database.db import Database
from backend.database.enums import OrderStatus

cancellation_router = Router()


@cancellation_router.callback_query(factories.order.cancellation.filter())
async def show_menu(
        query: CallbackQuery,
        bot: Bot,
        callback_data: factories.order.cancellation,
        db: Database
):
    user_id = query.from_user.id
    order_id = callback_data.order_id

    await db.limit_orders.update_order_status(order_id, OrderStatus.CANCELLED.value)

    await open_user_orders_menu(db, user_id, bot, query.message.message_id)

    await query.answer()

    # stop task
    is_cancelled = ton.order_tasks.cancel_task(order_id)
