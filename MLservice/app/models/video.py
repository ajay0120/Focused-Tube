from pydantic import BaseModel
from typing import List, Optional

class Video(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    channelTitle: Optional[str] = ""
    thumbnail: Optional[str] = ""
    publishedAt: Optional[str] = ""
    finalScore: Optional[float] = None
    isBlocked: Optional[bool] = None
    interestScore: Optional[float] = None
    disinterestScore: Optional[float] = None
    category: Optional[str] = ""
    wasOverride: Optional[bool] = None

class RankRequest(BaseModel):
    videos: List[Video]

class SearchRequest(BaseModel):
    query: str
    disinterests: List[str] = []
    interests: List[str] = []

class SearchResponse(BaseModel):
    videos: List[Video]
    blocked_count: int
    blocked_all: bool = False
