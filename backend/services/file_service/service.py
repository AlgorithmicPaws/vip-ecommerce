import os
import uuid
from datetime import datetime
from fastapi import UploadFile, HTTPException
import aiofiles

# Base directory for storing product images
# This should be in your public directory so images can be served statically
BASE_IMAGE_DIR = os.path.join(os.getcwd(), "static", "images", "products")

class FileService:
    """Service for handling file uploads"""
    
    @staticmethod
    async def upload_product_image(file: UploadFile, category: str, product_id: str):
        """
        Upload a product image and save it to the filesystem    
        
        Args:
            file: The image file to upload
            category: Product category (used for folder structure)
            product_id: Product ID (used for folder structure)
            
        Returns:
            Dict with file information
        """
        try:
            # Validate file type
            if not file.content_type.startswith("image/"):
                raise HTTPException(
                    status_code=400, 
                    detail="Only image files are allowed"
                )
                
            # Create a URL-friendly category name (lowercase, replace spaces with underscores)
            safe_category = category.lower().replace(" ", "_").replace("/", "_")
            
            # Create directory for this product
            # Structure: /static/images/products/{category}/{product_id}/
            product_dir = os.path.join(BASE_IMAGE_DIR, safe_category, str(product_id))
            os.makedirs(product_dir, exist_ok=True)
            
            # Generate unique filename with timestamp and UUID
            file_extension = os.path.splitext(file.filename)[1]
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            filename = f"{timestamp}_{unique_id}{file_extension}"
            
            # Full path to save the file
            file_path = os.path.join(product_dir, filename)
            
            # Save the file
            async with aiofiles.open(file_path, "wb") as out_file:
                content = await file.read()
                await out_file.write(content)
            
            # URL path (relative to static directory)
            url_path = f"/images/products/{safe_category}/{product_id}/{filename}"
            
            # Get file size
            file_size = os.path.getsize(file_path)
            
            return {
                "file_path": url_path,
                "file_name": filename,
                "file_size": file_size,
                "content_type": file.content_type
            }
            
        except Exception as e:
            print(f"Error uploading file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")