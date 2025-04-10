from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from core.database import engine
from models import Base
from services.user_service.router import router as user_router
from services.auth_service.router import router as auth_router
from services.auth_service.user_info_router import router as user_info_router
from services.seller_service.router import router as seller_router
from services.product_service.router import router as product_router
from services.product_service.category_router import router as category_router
from services.file_service.router import router as file_router

# Create the FastAPI app
app = FastAPI(
    title="E-Commerce API",
    description="API for E-Commerce platform",
    version="0.1.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",           
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Create static directory for file uploads if it doesn't exist
os.makedirs("static/images/products", exist_ok=True)

# Mount static directory to serve uploaded files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include service routers   
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(user_info_router)
app.include_router(seller_router)
app.include_router(product_router)
app.include_router(category_router)
app.include_router(file_router)  # Add the file service router

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the E-Commerce API"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}