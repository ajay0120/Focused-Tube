from fastapi import APIRouter
from app.controllers.rank_controller import router as rank_router

api_router = APIRouter()

api_router.include_router(rank_router, prefix="/videos", tags=["videos"])
