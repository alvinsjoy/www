from pydantic import BaseModel
class imageRequest(BaseModel):
    image_base64: str
