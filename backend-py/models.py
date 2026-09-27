from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class User(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="USER")
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Item(Base):
    __tablename__ = "Item"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    category = Column(String)
    costPrice = Column(Float)
    sellPrice = Column(Float)
    stockCount = Column(Integer)
    imageUrl = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
