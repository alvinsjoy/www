from fastapi import FastAPI
app = FastAPI()

@app.get("/api/hello")
@app.get("/hello")
def hello():
    return {"message": "Hello from FastAPI"}
# This is important for Vercel serverless functions
from mangum import Mangum
handler = Mangum(app)