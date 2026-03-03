from fastapi import APIRouter
from app.routes.search import router as search_router

api_router = APIRouter()

api_router.include_router(search_router, prefix="/videos", tags=["videos"])
