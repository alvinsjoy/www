from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import time
import random
import os

app = FastAPI()

# Add CORS only for local development (not on Vercel)
is_vercel = os.environ.get("VERCEL", "0") == "1"
if not is_vercel:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Detection models that match TypeScript interfaces
class DetectionResult(BaseModel):
    class_id: int
    class_name: str
    confidence: float

class DetectionResponse(BaseModel):
    results: List[DetectionResult]
    processing_time: float

# Handle both paths - the /api prefix is added by Vercel but not needed locally
@app.post("/detect")
@app.post("/api/detect")
async def detect_signs(file: UploadFile = File(...)):
    try:
        # Simulate processing time
        start_time = time.time()
        
        # Pretend to process the image
        contents = await file.read()
        
        # Example traffic sign classes
        signs = [
            {"class_id": 1, "class_name": "Speed limit (30km/h)", "confidence": 0.92},
            {"class_id": 14, "class_name": "Stop", "confidence": 0.97},
            {"class_id": 33, "class_name": "Turn right", "confidence": 0.88},
            {"class_id": 17, "class_name": "No entry", "confidence": 0.95},
            {"class_id": 38, "class_name": "Keep right", "confidence": 0.89}
        ]
        
        # Randomly select 0-3 signs to return
        num_detections = random.randint(0, 3)
        selected_signs = random.sample(signs, k=min(num_detections, len(signs)))
        
        # Calculate processing time (in milliseconds)
        processing_time = (time.time() - start_time) * 1000
        
        # Return response matching DetectionResponse type
        return {
            "results": selected_signs,
            "processing_time": processing_time
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# This is important for Vercel serverless functions
from mangum import Mangum
handler = Mangum(app)
