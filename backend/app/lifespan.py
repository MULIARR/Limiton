from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI

from backend.bot import bot, dp
from backend.clients import ton
from backend.config import config
from backend.database.db import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.async_init()
    await ton.async_init(bot)
    await ton.setup_limit_orders()

    await bot.set_webhook(
        url=f"{config.webhook.url}/webhook",
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )
    logging.info("Webhook configured")

    yield

    await bot.delete_webhook(drop_pending_updates=True)
    await ton.close()
    await db.close()
