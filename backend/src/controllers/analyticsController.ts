import { Request, Response } from "express";
import mongoose from "mongoose";
import UserActivity from "../models/UserActivity";
import UserDailyMetrics from "../models/UserDailyMetrics";
import logger from "../utils/logger";

declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

//Daily Statistics: Provides today's total watch time, productive time, distracting time, and blocked attempts
logger.info("🔥 Analytics Controller Loaded");
export const getDailyStatistics = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    // 🔥 Aggregate today's activity
    const activity = await UserActivity.aggregate([
      {
        $match: {
          userId,
          timestamp: { $gte: startOfDay, $lt: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalTime: { $sum: "$watchTime" }, // seconds
          blockedTime: {
            $sum: {
              $cond: [{ $eq: ["$isBlockedTopic", true] }, "$watchTime", 0],
            },
          },
          overrideCount: {
            $sum: {
              $cond: [{ $eq: ["$wasOverride", true] }, 1, 0],
            },
          },
        },
      },
    ]);

    if (activity.length === 0) {
      return res.json({
        totalWatchTime: 0,
        productiveTime: 0,
        distractingTime: 0,
        blockedAttempts: 0,
        distractionScore: 0,
      });
    }

    const { totalTime, blockedTime, overrideCount } = activity[0];

    // 🔥 Compute distraction score (0–1 scale)
    const ratio = blockedTime / (totalTime || 1);
    const overridePenalty = 1 - Math.exp(-0.3 * overrideCount);
    const distractionScore = Math.min(
      1,
      0.7 * ratio + 0.3 * overridePenalty
    );

    // 🔥 Upsert into UserDailyMetrics
    await UserDailyMetrics.findOneAndUpdate(
      { userId, date: startOfDay },
      {
        totalTime,
        blockedTime,
        overrideCount,
        distractionScore,
        date: startOfDay,
      },
      { upsert: true, new: true }
    );

    return res.json({
      totalWatchTime: totalTime,
      productiveTime: totalTime - blockedTime,
      distractingTime: blockedTime,
      blockedAttempts: overrideCount,
      distractionScore,
    });

  } catch (error: any) {
    logger.error(`DailyStats Error → ${error.message}`);
    return res.status(500).json({ error: "Failed to fetch daily statistics" });
  }
};



//Weekly Report: Provides trends and category breakdowns for the past 7 days

export const getWeeklyReport = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const dailyData = await UserDailyMetrics.find({
      userId,
      date: { $gte: start },
    }).sort({ date: 1 });

    const categoryData = await UserActivity.aggregate([
      {
        $match: {
          userId,
          timestamp: { $gte: start }
        }
      },
      {
        $group: {
          _id: "$category",
          totalWatchTime: { $sum: "$watchTime" }
        }
      },
      {
        $sort: { totalWatchTime: -1 }
      }
    ]);

    /* Moving Average (3-day)*/
    const movingAverage: number[] = [];

    for (let i = 0; i < dailyData.length; i++) {
      const prev1 = dailyData[i - 1]?.distractionScore || 0;
      const prev2 = dailyData[i - 2]?.distractionScore || 0;

      movingAverage.push(
        (
          dailyData[i].distractionScore +
          prev1 +
          prev2
        ) / 3
      );
    }

    /* Risk Level Logic*/
    const getRisk = (score: number) => {
      if (score < 0.2) return "LOW";
      if (score < 0.5) return "MODERATE";
      return "HIGH";
    };

    /* Focus Streak*/
    let focusStreak = 0;
    for (let i = dailyData.length - 1; i >= 0; i--) {
      if (dailyData[i].distractionScore < 0.3) {
        focusStreak++;
      } else {
        break;
      }
    }

    const latestScore =
      dailyData.length > 0
        ? dailyData[dailyData.length - 1].distractionScore
        : 0;

    return res.json({
      distractionTrend: dailyData.map((d) => ({
        _id: d.date.toISOString().slice(0, 10),
        distractingTime: d.blockedTime,
        distractionScore: d.distractionScore,
      })),

      overrideFrequency: dailyData.map((d) => ({
        _id: d.date.toISOString().slice(0, 10),
        count: d.overrideCount,
      })),

      timeByCategory: categoryData.map((c) => ({
        category: c._id,
        totalWatchTime: c.totalWatchTime,
      })),

      movingAverage,

      currentRiskLevel: getRisk(latestScore),

      focusStreak,

      productivityScore: 1 - latestScore,
    });

  } catch (error: any) {
    logger.error(`WeeklyReport Error → ${error.message}`);
    return res.status(500).json({ error: "Failed to fetch weekly report" });
  }
};



// Log Activity: Endpoint for logging user activity (for testing/demo purposes)
export const logActivity = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { videoId, category, watchTime, isBlockedTopic, wasOverride } = req.body;

    await UserActivity.create({
      userId: req.user.id,
      videoId,
      category,
      watchTime,
      isBlockedTopic,
      wasOverride,
      timestamp: new Date(),
    });

    return res.json({ success: true });

  } catch (error: any) {
    logger.error(`LogActivity Error → ${error.message}`);
    return res.status(500).json({ error: "Failed to log activity" });
  }
};