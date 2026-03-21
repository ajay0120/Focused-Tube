import logging
from typing import List
from app.services.bert_service import bert_service
from app.services.youtube_service import youtube_service
from app.services.embedding_service import embedding_service

logger = logging.getLogger(__name__)


class SearchController:

    def search(
        self,
        query: str,
        interests: List[str],
        disinterests: List[str]
    ) -> dict:

        clean_interests = [i.strip() for i in interests if i and i.strip()]
        clean_disinterests = [d.strip() for d in disinterests if d and d.strip()]
        print(f"Received search request: query='{query}', "
              f"interests={clean_interests}, disinterests={clean_disinterests}")
        # ── Step 1: Check query similarity against disinterests BEFORE fetching ──
        if clean_disinterests:
            query_blocked = embedding_service.block_mask(
                texts=[query],
                category="query",
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
        print("Query passed disinterest check, fetching videos...")
        # Step 2: Fetch YouTube videos
        videos = youtube_service.search(query, max_results=20)

        if not videos:
            return {
                "videos": [],
                "blocked_count": 0,
                "blocked_all": False,
            }
        
        # ── Step 3: If no disinterests, just rank and return ──
        if not clean_disinterests:
            ranked_videos = bert_service.rank_videos(
                videos=videos,
                interests=clean_interests,
                disinterests=[],
            )
            return {
                "videos": ranked_videos,
                "blocked_count": 0,
                "blocked_all": False,
            }
        
        # ── Step 4: Semantic filtering of individual videos ──
        texts = []
        category = []
        for v in videos:
            combined_text = (
                f"Query: {query}. "
                f"Title: {v.title}. "
                f"Description: {v.description}. "
                f"Category: {v.category}."
                f"Topic: {v.category}."
                f"Channel: {v.category}."
            )
            texts.append(combined_text)
            category.append(v.category)

        semantic_block = embedding_service.block_mask(
            texts=texts,
            category=category,
            disinterests=clean_disinterests,
            threshold=0.6,
        )

        allowed_videos = [
            video for video, blocked in zip(videos, semantic_block) if not blocked
        ]
        

        # Step 5: Semantic ranking + filtering
        ranked_videos = bert_service.rank_videos(
            videos=allowed_videos,
            interests=clean_interests,
            disinterests=clean_disinterests
        )

        blocked_count = len(videos) - len(ranked_videos)

        blocked_all = len(ranked_videos) == 0 and len(videos) > 0

        logger.info(
            f"Query '{query}' → returned {len(ranked_videos)} videos "
            f"(blocked {blocked_count})"
        )

        return {
            "videos": ranked_videos,
            "blocked_count": blocked_count,
            "blocked_all": blocked_all,
        }


search_controller = SearchController()
