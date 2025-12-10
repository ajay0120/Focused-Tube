from typing import List
from app.models.video import Video

class BertService:
    def rank_videos(self, videos: List[Video]) -> List[Video]:
        # TODO: Implement actual BERT logic here
        # Mock logic: details with 'tutorial' or 'course' get higher priority
        
        def score(video: Video):
            s = 0
            text = (video.title + " " + (video.description or "")).lower()
            if "tutorial" in text: s += 10
            if "course" in text: s += 10
            if "learn" in text: s += 5
            if "react" in text: s += 2 # Context awareness placeholder
            return s

        ranked_videos = sorted(videos, key=score, reverse=True)
        return ranked_videos

bert_service = BertService()
