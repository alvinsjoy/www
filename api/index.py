from fastapi import FastAPI, File, UploadFile, HTTPException
import time, random

app = FastAPI()

@app.get("/api/hello")
@app.get("/hello")
def hello():
    return {"message": "Hello from FastAPI"}

@app.post("/detect")
@app.post("/api/detect")
async def detect_signs(file: UploadFile = File(...)):
    try:
        start_time = time.time()
        contents = await file.read()
        signs = [
            {"class_id": 1, "class_name": "Speed limit (30km/h)", "confidence": 0.92},
            {"class_id": 14, "class_name": "Stop", "confidence": 0.97},
            {"class_id": 33, "class_name": "Turn right", "confidence": 0.88},
            {"class_id": 17, "class_name": "No entry", "confidence": 0.95},
            {"class_id": 38, "class_name": "Keep right", "confidence": 0.89}
        ]
        num_detections = random.randint(0, 3)
        selected_signs = random.sample(signs, k=min(num_detections, len(signs)))
        processing_time = (time.time() - start_time) * 1000
        return {"results": selected_signs, "processing_time": processing_time}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))