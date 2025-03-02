import fastapi
<<<<<<< HEAD
from fastapi import APIRouter,UploadFile
from PIL import Image
import io
=======
from fastapi import APIRouter
import base64
from PIL import Image
import io
from models.signalyse import imageRequest
>>>>>>> 16f3a0639cc303d1806746a048ad1e89ea3339af
from controllers.signalyse import detect_object

router=fastapi.APIRouter()
@router.post("/detect/")
<<<<<<< HEAD
async def Img_Convert(file: UploadFile):
    try:
      image_data = await file.read()
      image = Image.open(io.BytesIO(image_data)).convert("RGB")
      result=detect_object(image)
      return result
    except Exception as e:
       return {"error": str(e)}
=======
async def Img_Convert(image_request: imageRequest):
    image_data = base64.b64decode(image_request.image_base64)
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    result=detect_object(image)
    return result
>>>>>>> 16f3a0639cc303d1806746a048ad1e89ea3339af

      