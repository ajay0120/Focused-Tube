from fastapi import FastAPI
from app.routes.api import api_router
import uvicorn

app = FastAPI(title="FocusedTube ML Service")

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "FocusedTube ML Service is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
