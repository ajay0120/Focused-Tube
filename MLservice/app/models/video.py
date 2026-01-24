from pydantic import BaseModel
from typing import List, Optional

class Video(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    channelTitle: Optional[str] = ""
    thumbnail: Optional[str] = ""

class RankRequest(BaseModel):
    videos: List[Video]

class SearchRequest(BaseModel):
    query: str
    disinterests: List[str]
    videos: List[Video]

class SearchResponse(BaseModel):
    videos: List[Video]
    blocked_count: int
