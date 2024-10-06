from sqlalchemy import Column, BigInteger, LargeBinary, String, Sequence, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from backend.database.base import Base


class TonWallet(Base):
    __tablename__ = 'ton_wallets'

    wallet_id = Column(BigInteger, Sequence('ton_wallet_seq'), primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id'), nullable=False)
    mnemonics = Column(LargeBinary, nullable=False)
    name = Column(String(255), nullable=False)
    selected = Column(Boolean, default=True)

    user = relationship('User', back_populates='wallets')
