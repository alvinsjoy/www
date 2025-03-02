from fastapi import FastAPI
from api import signalyse

app=FastAPI()
app.include_router(signalyse.router)