from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from api import signalyse  

app = FastAPI()


app.include_router(signalyse.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://signalyze.vercel.app/"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
