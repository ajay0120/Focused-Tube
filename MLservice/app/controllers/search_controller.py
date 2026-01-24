from typing import List
from app.models.video import Video
from app.services.embedding_service import embedding_service
from app.services.bert_service import bert_service

class SearchController:
    def search(
        self,
        query: str,
        disinterests: List[str],
        videos: List[Video],
        threshold: float = 0.75
    ) -> List[Video]:

        # 1️⃣ Filter using embeddings
        allowed_videos = []
        for video in videos:
            combined_text = f"{video.title} {video.description} {video.channelTitle}"

            blocked, _ = embedding_service.is_blocked(
                query=combined_text,
                disinterests=disinterests,
                threshold=threshold
            )

            if not blocked:
                allowed_videos.append(video)

        # 2️⃣ Rank remaining videos
        ranked_videos = bert_service.rank_videos(allowed_videos)

        return ranked_videos


search_controller = SearchController()
