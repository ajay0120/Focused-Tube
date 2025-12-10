from fastapi import APIRouter, HTTPException
from app.models.video import RankRequest, Video
from app.services.bert_service import bert_service
from typing import List

router = APIRouter()

@router.post("/rank", response_model=List[Video])
def rank_videos(request: RankRequest):
    try:
        ranked_videos = bert_service.rank_videos(request.videos)
        return ranked_videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
