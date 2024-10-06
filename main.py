import asyncio
import logging
import os

import uvicorn
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import Update
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing_extensions import AsyncGenerator

from backend.api import api_router
from backend.bot.handlers import main_router
from backend.bot.middlewares.config import ConfigMiddleware
from backend.classes import ton
from backend.config import config
from backend.database.db import db

logging.basicConfig(level=logging.INFO)

bot = Bot(
    token=config.tg_bot.token,
    default=DefaultBotProperties(
        parse_mode=ParseMode.HTML,
        allow_sending_without_reply=True,
        link_preview_is_disabled=True
    )
)

storage = MemoryStorage()
dp = Dispatcher(storage=storage)


async def start_bot() -> None:
    dp.include_router(main_router)
    register_global_middlewares(dp)


def register_global_middlewares(dp: Dispatcher):
    """
    Register global middlewares for the given dispatcher.
    Global middlewares here are the ones that are applied to all the handlers
    """
    middleware_types = [
        ConfigMiddleware(config, db),
    ]

    for middleware_type in middleware_types:
        dp.message.outer_middleware(middleware_type)
        dp.callback_query.outer_middleware(middleware_type)


async def lifespan(app: FastAPI) -> AsyncGenerator:
    try:
        await bot.set_webhook(
            url=f"{config.webhook.url}/webhook",
            allowed_updates=dp.resolve_used_update_types(),
            drop_pending_updates=True
        )
        logging.info("Webhook configured")

        yield
    finally:
        await bot.delete_webhook(drop_pending_updates=True)
        await db.close()


def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)

    app.include_router(api_router)

    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


# Creating an application at the module level (to run the application locally)
#  -> uvicorn launcher:app --reload --port 8005
app = create_app()


@app.post("/webhook")
async def webhook(request: Request) -> None:
    update = Update.model_validate(await request.json(), context={"bot": bot})
    await dp.feed_update(bot, update)


async def start_app() -> None:
    port = int(os.environ.get("PORT", 9097))
    config = uvicorn.Config(app, port=port, log_level="info")
    # config = uvicorn.Config(app, host="0.0.0.0", port=port, log_level="info")
    server = uvicorn.Server(config)

    await server.serve()


async def setup_limit_orders() -> None:
    orders = await db.limit_orders.get_active_orders()
    limit_orders_models = await ton.limit_orders.create_limit_order_models(orders)

    # extract user ids from models
    users_ids = [order_modal.user_id for order_modal in limit_orders_models]

    # get users wallets models from db
    users_wallets = await db.ton_wallets.get_selected_wallets(users_ids)

    # save user wallets in local memory
    ton.limit_orders.init_user_wallets(users_wallets)

    await ton.limit_orders.launch_limit_orders(limit_orders_models)


async def main() -> None:
    await ton.async_init(bot)
    await db.async_init()

    await setup_limit_orders()

    bot_task = asyncio.create_task(start_bot())
    app_task = asyncio.create_task(start_app())

    await asyncio.gather(bot_task, app_task)


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.error("SYSTEM OFF")
