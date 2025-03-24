from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine
from models import Base
from services.user_service.router import router as user_router
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

# Include service routers
app.include_router(user_router)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the E-Commerce API"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}