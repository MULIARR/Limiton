from sqlalchemy import Column, BigInteger, String, Float, DateTime, ForeignKey, Integer

from backend.database.base import Base
from sqlalchemy.dialects.postgresql import ARRAY
import datetime


class Order(Base):
    __tablename__ = 'orders'

    order_id = Column(String, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id'), nullable=False)
    send_amount = Column(Float, nullable=False)
    send_token_address = Column(String, nullable=False)
    receive_amount = Column(Float, nullable=False)
    receive_token_address = Column(String, nullable=False)
    minimum_to_receive_amount = Column(Float, nullable=False)
    slippage = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    completion_date = Column(DateTime, nullable=True)

    # profit_percentage = Column(ARRAY(Integer), nullable=True)
    # profit_in_ton = Column(Float, nullable=True)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
