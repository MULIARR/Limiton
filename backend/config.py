from dataclasses import dataclass
from environs import Env


@dataclass
class DbConfig:
    """
    Database configuration class.
    This class holds the settings for the database, such as host, password, port, etc.
    """

    database_url: str

    @staticmethod
    def from_env(env: Env):
        """
        Creates the DbConfig object from environment variables.
        """
        host = env.str("DB_HOST")
        password = env.str("POSTGRES_PASSWORD")
        user = env.str("POSTGRES_USER")
        database = env.str("POSTGRES_DB")
        port = env.int("DB_PORT", 5432)

        database_url = f'postgresql+asyncpg://{user}:{password}@{host}/{database}'

        return DbConfig(
            database_url=database_url
        )


@dataclass
class TgBotConfig:
    """
    Telegram bot configuration class.
    """

    token: str
    admin_ids: list[int]
    use_redis: bool

    @staticmethod
    def from_env(env: Env):
        """
        Creates the TgBot object from environment variables.
        """
        token = env.str("BOT_TOKEN")
        admin_ids = list(map(int, env.list("ADMINS")))
        use_redis = env.bool("USE_REDIS")

        return TgBotConfig(
            token=token,
            admin_ids=admin_ids,
            use_redis=use_redis
        )


@dataclass
class TONApiConfig:
    """
    Fernet configuration class.
    """

    key: str

    @staticmethod
    def from_env(env: Env):
        """
        Creates the Fernet object from environment variables.
        """
        tonapi_key = env.str("TONAPI_KEY")

        return TONApiConfig(
            key=tonapi_key
        )


@dataclass
class EncryptionConfig:
    """
    Fernet configuration class.
    """

    encryption_key: str

    @staticmethod
    def from_env(env: Env):
        """
        Creates the Fernet object from environment variables.
        """
        encryption_key = env.str("ENCRYPTION_KEY")

        return EncryptionConfig(
            encryption_key=encryption_key
        )


@dataclass
class Webhook:
    url: str

    @staticmethod
    def from_env(env: Env):
        url = env.str("WEBHOOK_URL")
        return Webhook(url=url)


@dataclass
class Config:
    """
    The main configuration class that integrates all the other configuration classes.
    This class holds the other configuration classes, providing a centralized point of access for all settings.
    """

    # app: AppConfig
    tg_bot: TgBotConfig
    tonapi: TONApiConfig
    encryption: EncryptionConfig
    db: DbConfig
    webhook: Webhook


def load_config(path: str = None) -> Config:
    """
    This function takes an optional file path as input and returns a Config object.
    :param path: The path of env file from where to load the configuration variables.
    It reads environment variables from a .env file if provided, else from the process environment.
    :return: Config object with attributes set as per environment variables.
    """

    env = Env()
    env.read_env(path)

    return Config(
        tg_bot=TgBotConfig.from_env(env),
        tonapi=TONApiConfig.from_env(env),
        encryption=EncryptionConfig.from_env(env),
        db=DbConfig.from_env(env),
        webhook=Webhook.from_env(env)
    )


config = load_config(".env")
