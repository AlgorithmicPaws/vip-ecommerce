from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from core.database import get_db
from services.auth_service.middleware import get_current_seller, get_current_user
from .service import FileService
from .schemas import FileUploadResponse

router = APIRouter(
    prefix="/files",
    tags=["files"]
)

@router.post("/product-image", response_model=FileUploadResponse)
async def upload_product_image(
    file: UploadFile = File(...),
    category: str = Form("uncategorized"),
    product_id: str = Form("new"),
    seller = Depends(get_current_seller),  # Requires seller authentication
    db: Session = Depends(get_db)
):
    """
    Upload a product image and save it to the filesystem
    
    Args:
        file: The image file to upload
        category: Product category (used for folder structure)
        product_id: Product ID (used for folder structure)
        
    Returns:
        JSON with the saved file path
    """
    result = await FileService.upload_product_image(file, category, product_id)
    return result