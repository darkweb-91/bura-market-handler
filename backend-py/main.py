from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from routers import auth, items, ai
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bura Market Handler API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(items.router, prefix="/api/items", tags=["items"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
def read_root():
    return {"message": "Bura Market Handler API (Python) is running"}
