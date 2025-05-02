from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import Request
from fastapi.responses import JSONResponse
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

# Load CORS allowed origins from environment variable or use default
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "*").split(",")

# Create the FastAPI app
app = FastAPI(
    title="E-Commerce API",
    description="API for E-Commerce platform",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
origins = CORS_ALLOWED_ORIGINS if CORS_ALLOWED_ORIGINS != ["*"] else ["*"] 

# Add default development origins if not using wildcard
if "*" not in origins:
    origins.extend([
        "http://localhost",           
        "http://localhost:80",
        "http://localhost:5173",           
        "http://127.0.0.1:5173",
        "http://frontend",  # For Docker service name
        "https://vipscm.shop",  # Production domain with HTTPS
        "http://vipscm.shop",   # Production domain without HTTPS 
        "http://168.231.73.206" # Server IP
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=1728000
)
# Add a specific OPTIONS handler at the application level
@app.options("/{full_path:path}")
async def options_handler(request: Request):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept",
            "Access-Control-Max-Age": "1728000",
        },
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
app.include_router(file_router)
app.include_router(order_router)  # Add the order service router

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the E-Commerce API"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}
