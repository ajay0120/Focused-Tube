from typing import List
from app.models.video import Video
from app.services.embedding_service import embedding_service
from app.services.bert_service import bert_service

class SearchController:
    def search(
        self,
        query: str,
        disinterests: List[str],
        videos: List[Video]
    ) -> List[Video]:

        disinterest_keywords = [d.lower() for d in disinterests]

        texts = []
        keyword_block = []

        for v in videos:
            combined_text = (
                f"{v.title} "
                f"{v.description} "
                f"{v.channelTitle}"
            ).lower()

            texts.append(
                f"{v.title}. {v.description}. Channel name: {v.channelTitle}."
            )

            # 🔴 HARD keyword guardrail
            keyword_block.append(
                any(k in combined_text for k in disinterest_keywords)
            )

        # 🔹 Semantic blocking
        semantic_block = embedding_service.block_mask(
            texts=texts,
            disinterests=disinterests,
            threshold=0.6   # lower, because keyword is primary
        )

        allowed_videos = []
        for video, kw_blocked, sem_blocked in zip(videos, keyword_block, semantic_block):
            if not kw_blocked and not sem_blocked:
                allowed_videos.append(video)

        ranked_videos = bert_service.rank_videos(allowed_videos)
        
        return {
            "videos": ranked_videos,
            "blocked_count": len(videos) - len(allowed_videos)
        }


search_controller = SearchController()
