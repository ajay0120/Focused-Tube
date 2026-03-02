from fastapi import APIRouter, HTTPException
from app.models.video import SearchRequest, SearchResponse
from app.controllers.search_controller import search_controller

router = APIRouter()

@router.post("/search", response_model=SearchResponse)
def search_videos(request: SearchRequest):
    try:
        return search_controller.search(
            query=request.query,
            disinterests=request.disinterests,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
