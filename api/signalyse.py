import fastapi
from fastapi import APIRouter
import base64
from PIL import Image
import io
from models.signalyse import imageRequest
from controllers.signalyse import detect_object

router=fastapi.APIRouter()
@router.post("/detect/")
async def Img_Convert(image_request: imageRequest):
    image_data = base64.b64decode(image_request.image_base64)
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    result=detect_object(image)
    return result

      