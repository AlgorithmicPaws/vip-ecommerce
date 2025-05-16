from fastapi import FastAPI, Request
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
from services.order_service.router import router as order_router 

# Load CORS allowed origins from environment variable
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "*").split(",")

# Create the FastAPI app
app = FastAPI(
    title="E-Commerce API",
    description="API for E-Commerce platform",
    version="0.1.0"
)

# Process CORS origins
origins = []
if "*" in CORS_ALLOWED_ORIGINS:
    origins = ["*"]
else:
    origins = [origin.strip() for origin in CORS_ALLOWED_ORIGINS if origin.strip()]
    # Add common development origins
    origins.extend([
        "http://localhost",
        "http://localhost:80",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://frontend",
        "http://vipscm.shop/api",
    ])
    # Remove duplicates
    origins = list(set(origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database and routes setup remains the same...
Base.metadata.create_all(bind=engine)
os.makedirs("static/images/products", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(user_info_router)
app.include_router(seller_router)
app.include_router(product_router)
app.include_router(category_router)
app.include_router(file_router)
app.include_router(order_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the E-Commerce API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/cors-debug")
async def cors_debug(request: Request):
    return {
        "cors_allowed_origins": CORS_ALLOWED_ORIGINS,
        "effective_origins": origins,
        "headers": dict(request.headers)
    }