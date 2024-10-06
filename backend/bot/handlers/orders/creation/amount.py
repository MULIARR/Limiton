from aiogram import Router, F, Bot
from aiogram.fsm.context import FSMContext
from aiogram.types import Message

from backend.bot.handlers.orders.creation.menu import open_order_creation
from backend.bot.handlers.orders.creation.order_vault import order_vault
from backend.bot.keyboards import keyboards
from backend.bot.states.order import EnterAmount
from backend.bot.texts import texts
from backend.classes import ton

amount_router = Router()


@amount_router.message(EnterAmount.enter, F.text)
async def make_invoice(
        message: Message,
        state: FSMContext,
        bot: Bot
):
    await message.delete()

    user_id = message.from_user.id
    amount = message.text

    order = await order_vault.load_order(state)

    if validate_amount(amount):
        amount = float(amount)

        # if amount is correct
        if order.setting_up_send_token:
            kwargs = {"send_token": {"amount": amount}}

            if order.receive_token:
                # if pool exist -> estimate swap out and update receive amount too
                [send_asset, _], pool = await ton.dedust.get_pool_and_assets(
                    order.send_token.address, order.receive_token.address
                )

                is_pool_exist = await ton.dedust.check_pool_exists(pool)

                if is_pool_exist:
                    # estimate and update receive amount too
                    estimated_swap_amount = await ton.dedust.estimate_swap(
                        send_asset, amount, order.send_token.decimals, order.receive_token.decimals, pool
                    )
                    kwargs["receive_token"] = {"amount": round(estimated_swap_amount, 2)}

            await order_vault.update_order(state, **kwargs)
        else:
            await order_vault.update_order(state, receive_token={"amount": amount})

        # get out of the state
        await state.set_state(state=None)

        await open_order_creation(bot, user_id, order.message_id, state)
    else:
        await bot.edit_message_text(
            chat_id=user_id,
            text=texts.orders.AMOUNT_INCORRECT,
            message_id=order.message_id,
            reply_markup=keyboards.orders.create_back_to_order_markup()
        )


def validate_amount(amount) -> bool:
    try:
        amount = float(amount)
    except ValueError:
        return False

    if amount < 0.000000001:
        return False

    return True