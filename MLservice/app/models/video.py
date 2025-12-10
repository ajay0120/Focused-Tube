from pydantic import BaseModel
from typing import List, Optional

class Video(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    channelTitle: Optional[str] = ""

class RankRequest(BaseModel):
    videos: List[Video]
