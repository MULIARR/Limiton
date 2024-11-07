from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

from backend.bot.handlers import main_router
from backend.bot.middlewares.config import ConfigMiddleware
from backend.config import config
from backend.database.db import db

bot = Bot(
    token=config.tg_bot.token,
    default=DefaultBotProperties(
        parse_mode=ParseMode.HTML,
        allow_sending_without_reply=True,
        link_preview_is_disabled=True
    )
)

storage = MemoryStorage()
dp = Dispatcher(storage=storage, db=db)
dp.include_router(main_router)


middleware_types = [
    ConfigMiddleware(config, db),
]

for middleware_type in middleware_types:
    dp.message.outer_middleware(middleware_type)
    dp.callback_query.outer_middleware(middleware_type)
