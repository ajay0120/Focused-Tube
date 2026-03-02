import logging
from typing import List
from app.models.video import Video
from app.services.embedding_service import embedding_service
from app.services.bert_service import bert_service
from app.services.youtube_service import youtube_service

logger = logging.getLogger(__name__)


class SearchController:
    def search(self, query: str, disinterests: List[str]) -> dict:

        clean_disinterests = [d.strip() for d in disinterests if d and d.strip()]

        # ── Step 1: Check query similarity against disinterests BEFORE fetching ──
        if clean_disinterests:
            query_blocked = embedding_service.block_mask(
                texts=[query],
                disinterests=clean_disinterests,
                threshold=0.5,
            )[0]

            if query_blocked:
                logger.info(
                    f"Query '{query}' blocked — matches disinterests. "
                    "Skipping YouTube API call."
                )
                return {
                    "videos": [],
                    "blocked_count": 0,
                    "blocked_all": True,
                }

        # ── Step 2: Fetch videos from YouTube ──
        videos = youtube_service.search(query)

        if not videos:
            return {
                "videos": [],
                "blocked_count": 0,
                "blocked_all": False,
            }

        # ── Step 3: If no disinterests, just rank and return ──
        if not clean_disinterests:
            ranked_videos = bert_service.rank_videos(videos)
            return {
                "videos": ranked_videos,
                "blocked_count": 0,
                "blocked_all": False,
            }

        # ── Step 4: Semantic filtering of individual videos ──
        texts = []
        for v in videos:
            combined_text = (
                f"Query: {query}. "
                f"Title: {v.title}. "
                f"Description: {v.description}. "
                f"Channel: {v.channelTitle}."
            )
            texts.append(combined_text)

        semantic_block = embedding_service.block_mask(
            texts=texts,
            disinterests=clean_disinterests,
            threshold=0.6,
        )

        allowed_videos = [
            video for video, blocked in zip(videos, semantic_block) if not blocked
        ]

        ranked_videos = bert_service.rank_videos(allowed_videos)

        blocked_count = len(videos) - len(allowed_videos)
        logger.info(
            f"Filtered {blocked_count}/{len(videos)} videos for query '{query}'"
        )

        return {
            "videos": ranked_videos,
            "blocked_count": blocked_count,
            "blocked_all": False,
        }


search_controller = SearchController()
