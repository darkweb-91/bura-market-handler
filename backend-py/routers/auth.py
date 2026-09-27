import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserLogin, Token, UserOut
from security import get_password_hash, verify_password, create_access_token
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SUPERADMIN_PASSCODE = os.getenv("SUPERADMIN_PASSCODE", "BURA_ADMIN_2024")

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    role = "USER"
    if user.passcode:
        if user.passcode == SUPERADMIN_PASSCODE:
            role = "SUPERADMIN"
        else:
            raise HTTPException(status_code=400, detail="Invalid superadmin passcode")
            
    hashed_password = get_password_hash(user.password)
    
    new_user = User(email=user.email, password=hashed_password, role=role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"id": new_user.id, "role": new_user.role})
    
    return {"token": token, "user": new_user}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    if user.passcode != SUPERADMIN_PASSCODE:
        raise HTTPException(status_code=403, detail="Invalid superadmin passcode")
        
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    token = create_access_token(data={"id": db_user.id, "role": db_user.role})
    
    return {"token": token, "user": db_user}
