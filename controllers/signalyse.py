import time
import numpy as np
import torch
from ultralytics import YOLO

# Load YOLO model
model = YOLO("best.pt")

# Class names for detected objects
CLASS_NAMES = [
    'Crossroad', 'Cycle Prohibited', 'Gap in the Median', 'Give Way', 'Go Slow', 'Horn Prohibited',
    'Hospital', 'Keep Left', 'Left turn', 'Men at Work', 'No Entry', 'No Left Turn', 'No Overtaking',
    'No Parking', 'No Right Turn', 'No Stopping', 'Parking', 'Pedestrian Crossing', 'Right Turn',
    'Roundabout', 'School Ahead', 'Side Road Left', 'Side Road Right', 'Speed Breaker', 'Speed Limit 20',
    'Speed Limit 30', 'Speed Limit 40', 'Speed Limit 50', 'Speed Limit 60', 'Speed Limit 80', 'Stop',
    'T Intersection', 'Traffic Signal Ahead', 'U-Turn Prohibited', 'U-turn', 'Y Intersection', 'Zigzag Road'
]

def detect_object(image):
    
    start_time = time.time() 

    image_np = np.array(image)  
    results = model(image_np)[0]  

    detected_objects = []
    for box in results.boxes:
        class_id = int(box.cls.item())  
        confidence = float(box.conf.item())  
        
        class_name = CLASS_NAMES[class_id] if class_id < len(CLASS_NAMES) else "Unknown"

        detected_objects.append({
            "class_id": class_id,
            "class_name": class_name,
            "confidence": confidence
        })

    processing_time = round(time.time() - start_time, 4)  

    return {
        "results": detected_objects,
        "processing_time": processing_time
    }
