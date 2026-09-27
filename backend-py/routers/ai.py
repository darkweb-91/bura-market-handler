import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import Item, User
from security import get_current_user
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    items = db.query(Item).all()
    
    total_items = len(items)
    total_stock_value = sum(item.costPrice * item.stockCount for item in items)
    potential_profit = sum((item.sellPrice - item.costPrice) * item.stockCount for item in items)
    
    context = (
        f"You are Bura Market Handler AI, an inventory assistant. "
        f"Current Inventory Context: Total Items: {total_items}, "
        f"Total Stock Value: ${total_stock_value:.2f}, "
        f"Potential Profit: ${potential_profit:.2f}. "
    )
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(f"{context}\n\nUser Question: {request.message}")
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
