import os
import requests
import logging
from typing import List
from dotenv import load_dotenv
from app.models.video import Video

load_dotenv()

logger = logging.getLogger(__name__)

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


class YouTubeService:
    def search(self, query: str, max_results: int = 10) -> List[Video]:
        """
        Fetch videos from YouTube Data API v3 for the given query.
        Returns a list of Video objects.
        """
        if not YOUTUBE_API_KEY:
            logger.warning("YOUTUBE_API_KEY not set — returning empty results")
            return []

        try:
            response = requests.get(
                YOUTUBE_SEARCH_URL,
                params={
                    "part": "snippet",
                    "maxResults": max_results,
                    "q": query,
                    "type": "video",
                    "key": YOUTUBE_API_KEY,
                },
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()

            videos = []
            for item in data.get("items", []):
                video = Video(
                    id=item["id"]["videoId"],
                    title=item["snippet"]["title"],
                    description=item["snippet"].get("description", ""),
                    thumbnail=item["snippet"]["thumbnails"]["medium"]["url"],
                    channelTitle=item["snippet"].get("channelTitle", ""),
                    publishedAt=item["snippet"].get("publishedAt", ""),
                )
                videos.append(video)

            logger.info(f"YouTube API returned {len(videos)} videos for query: '{query}'")
            return videos

        except requests.exceptions.HTTPError as e:
            status = e.response.status_code if e.response else "unknown"
            logger.error(f"YouTube API HTTP error ({status}): {e}")
            if status == 403:
                logger.warning("Likely quota exceeded or invalid API key")
            return []
        except Exception as e:
            logger.error(f"YouTube API error: {e}")
            return []


youtube_service = YouTubeService()
