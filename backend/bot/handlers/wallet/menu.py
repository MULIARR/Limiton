from aiogram import Router, Bot, F
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery

from backend.bot.keyboards import keyboards
from backend.bot.texts import texts
from backend.classes import ton
from backend.database.db import Database
from backend.utils.format_number import format_number

menu_router = Router()


@menu_router.callback_query(F.data == "user_wallet")
async def show_menu(
        query: CallbackQuery,
        bot: Bot,
        state: FSMContext,
        db: Database
):
    user_id = query.from_user.id

    await state.clear()

    await bot.edit_message_text(
        chat_id=user_id,
        text=texts.wallet.LOADING,
        reply_markup=keyboards.wallet.create_wallet_markup(),
        message_id=query.message.message_id
    )

    try:
        wallet = await db.ton_wallets.get_selected_wallet(user_id)
        wallet = ton.wallets.get_wallet(wallet.mnemonics)

        address = wallet.address
        portfolio = await ton.accounts.get_portfolio(address)
    except Exception as e:
        print(e)
        await query.answer("Try Again Later", show_alert=True)
        return

    jettons = "\n\n".join(f"<b>{asset.name}</b>: {asset.balance} {asset.symbol} (${asset.balance_in_usd})" for asset in portfolio.assets)  # noqa

    await bot.edit_message_text(
        chat_id=user_id,
        text=texts.wallet.MENU.format(
            interface=portfolio.wallet_interface,
            jettons=jettons,
            address=address,
            status=portfolio.status,
            balance=format_number(portfolio.total_balance)
        ),
        reply_markup=keyboards.wallet.create_wallet_markup(),
        message_id=query.message.message_id
    )

    await query.answer()