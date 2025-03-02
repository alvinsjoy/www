import fastapi
from fastapi import APIRouter,UploadFile
from PIL import Image
import io
from controllers.signalyse import detect_object

router=fastapi.APIRouter()
@router.post("/detect/")
async def Img_Convert(file: UploadFile):
    try:
      image_data = await file.read()
      image = Image.open(io.BytesIO(image_data)).convert("RGB")
      result=detect_object(image)
      return result
    except Exception as e:
       return {"error": str(e)}


      
