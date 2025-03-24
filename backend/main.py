from fastapi import FastAPI
from core.database import engine
from models import Base
from services.user_service.router import router as user_router


# Create the FastAPI app
app = FastAPI(
    title="E-Commerce API",
    description="API for E-Commerce platform",
    version="0.1.0"
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