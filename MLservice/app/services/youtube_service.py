from app.models.video import Video
from typing import List
import logging
import requests
import os
from dotenv import load_dotenv

YT_CATEGORY_MAP = {
    "1": "Film & Animation",
    "2": "Autos & Vehicles",
    "10": "Music",
    "15": "Pets & Animals",
    "17": "Sports",
    "20": "Gaming",
    "22": "People & Blogs",
    "23": "Comedy",
    "24": "Entertainment",
    "25": "News & Politics",
    "26": "Howto & Style",
    "27": "Education",
    "28": "Science & Technology",
}

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_SEARCH_URL = os.getenv("YOUTUBE_SEARCH_URL")
YOUTUBE_VIDEOS_URL = os.getenv("YOUTUBE_VIDEOS_URL")

logger = logging.getLogger(__name__)

class YouTubeService:
    def search(self, query: str, max_results: int = 20) -> List[Video]:

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
            video_ids = [item["id"]["videoId"] for item in data.get("items", [])]
            category_map = {}

            if video_ids:
                details_response = requests.get(
                    YOUTUBE_VIDEOS_URL,
                    params={
                        "part": "snippet",
                        "id": ",".join(video_ids),
                        "key": YOUTUBE_API_KEY,
                    },
                    timeout=10,
                )
                details_response.raise_for_status()
                details_data = details_response.json()

                for item in details_data.get("items", []):
                    category_map[item["id"]] = item["snippet"].get("categoryId")


            videos = []
            for item in data.get("items", []):
                video_id = item["id"]["videoId"]
                category_id = category_map.get(video_id)

                video = Video(
                    id=video_id,
                    title=item["snippet"]["title"],
                    description=item["snippet"].get("description", ""),
                    thumbnail=item["snippet"]["thumbnails"]["medium"]["url"],
                    channelTitle=item["snippet"].get("channelTitle", ""),
                    publishedAt=item["snippet"].get("publishedAt", ""),
                    category=YT_CATEGORY_MAP.get(category_id, "Other"),
                    isBlocked=False,
                    wasOverride=False,
                )
                videos.append(video)
                
            logger.info(f"YouTube API returned {len(videos)} videos for query: '{query}'")
            return videos

        except Exception as e:
            logger.error(f"YouTube API error: {e}")
            status = e.response.status_code if e.response else "unknown"
            logger.error(f"YouTube API HTTP error ({status}): {e}")
            if status == 403:
                logger.warning("Likely quota exceeded or invalid API key")
            return []

youtube_service = YouTubeService()