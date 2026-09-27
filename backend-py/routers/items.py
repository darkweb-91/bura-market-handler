import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Item, User
from schemas import ItemOut, ItemCreate
from security import get_current_user
import uuid

import cloudinary
import cloudinary.uploader

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=List[ItemOut])
def get_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    return items

@router.post("/", response_model=ItemOut)
def create_item(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    category: str = Form(...),
    costPrice: float = Form(...),
    sellPrice: float = Form(...),
    stockCount: int = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_url = None
    if image:
        # Check if cloudinary is configured
        if os.getenv("CLOUDINARY_URL"):
            result = cloudinary.uploader.upload(image.file)
            image_url = result.get("secure_url")
        else:
            ext = os.path.splitext(image.filename)[1]
            filename = f"{uuid.uuid4()}{ext}"
            filepath = os.path.join(UPLOAD_DIR, filename)
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_url = f"/uploads/{filename}"

    new_item = Item(
        name=name,
        description=description,
        category=category,
        costPrice=costPrice,
        sellPrice=sellPrice,
        stockCount=stockCount,
        imageUrl=image_url
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{id}")
def delete_item(id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}
