from pydantic import BaseModel
from typing import Optional

class FileUploadResponse(BaseModel):
    """Schema for file upload response"""
    file_path: str
    file_name: str
    file_size: int
    content_type: str
    