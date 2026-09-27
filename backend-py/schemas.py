from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    passcode: Optional[str] = None

class UserOut(UserBase):
    id: int
    role: str
    
    class Config:
        orm_mode = True

class UserLogin(UserBase):
    password: str
    passcode: str

class Token(BaseModel):
    token: str
    user: UserOut

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    costPrice: float
    sellPrice: float
    stockCount: int
    imageUrl: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemOut(ItemBase):
    id: int
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        orm_mode = True
