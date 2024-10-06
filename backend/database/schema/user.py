from sqlalchemy import Column, BigInteger, DateTime
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import relationship

from datetime import datetime

from backend.database.base import Base


class User(Base):
    __tablename__ = 'users'

    user_id = Column(BigInteger, primary_key=True)
    language = Column(ENUM('en', 'ru', 'ua', name='language_code'), nullable=False)
    join_date = Column(DateTime, default=datetime.utcnow)

    wallets = relationship('TonWallet', back_populates='user')
