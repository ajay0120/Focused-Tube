import axios from "axios";
import logger from "../utils/logger";
import User from "../models/User";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

interface SearchResult {
  videos: Video[];
  blockedCount: number;
  blockedAll: boolean;
}

export const searchVideos = async (
  query: string,
  user?: any,
): Promise<SearchResult> => {
  try {
    // Forward query + disinterests to ML service
    // ML service handles: disinterest check → YouTube fetch → filter → rank
    const mlResponse = await axios.post(
      "http://localhost:8000/api/videos/search",
      {
        query: query,
        disinterests: user?.disinterests || [],
      },
    );

    const data = mlResponse.data;

    if (data && Array.isArray(data.videos)) {
      const blockedAll = Boolean(data.blocked_all);
      const blockedCount = Number(data.blocked_count || 0);

      logger.info(
        `ML service returned ${data.videos.length} videos. Blocked: ${blockedCount}. BlockedAll: ${blockedAll}`,
      );

      // Update user blocked count if any videos were blocked
      if (user && blockedCount > 0) {
        await User.findByIdAndUpdate(user._id, {
          $inc: { distractionsBlocked: blockedCount },
        });
        logger.info(
          `Incremented blocked count for user ${user._id} by ${blockedCount}`,
        );
      }

      return {
        videos: data.videos,
        blockedCount,
        blockedAll,
      };
    }

    return {
      videos: [],
      blockedCount: 0,
      blockedAll: false,
    };
  } catch (error: any) {
    logger.error(`ML Service Error: ${error.message}`);
    return {
      videos: [],
      blockedCount: 0,
      blockedAll: false,
    };
  }
};
