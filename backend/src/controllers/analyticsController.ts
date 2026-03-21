import { Request, Response } from "express";
import mongoose from "mongoose";
import UserActivity from "../models/UserActivity";
import UserDailyMetrics from "../models/UserDailyMetrics";
import User from "../models/User";
import logger from "../utils/logger";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const getDailyStatistics = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized daily statistics request");
      return res.status(401).json({ error: "User not authenticated" });
    }

    logger.info("Daily statistics requested", { userId: req.user.id });
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

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
          totalTime: { $sum: "$watchTime" },
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
      logger.info("No daily activity found", { userId: req.user.id });
      return res.json({
        totalWatchTime: 0,
        productiveTime: 0,
        distractingTime: 0,
        blockedAttempts: 0,
        distractionScore: 0,
      });
    }

    const { totalTime, blockedTime, overrideCount } = activity[0];
    const ratio = blockedTime / (totalTime || 1);
    const overridePenalty = 1 - Math.exp(-0.3 * overrideCount);
    const distractionScore = Math.min(1, 0.7 * ratio + 0.3 * overridePenalty);

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

    logger.info("Daily statistics computed", {
      userId: req.user.id,
      totalTime,
      blockedTime,
      overrideCount,
      distractionScore,
    });

    return res.json({
      totalWatchTime: totalTime,
      productiveTime: totalTime - blockedTime,
      distractingTime: blockedTime,
      blockedAttempts: overrideCount,
      distractionScore,
    });
  } catch (error: any) {
    logger.error("Daily statistics failed", { userId: req.user?.id, error: error.message });
    return res.status(500).json({ error: "Failed to fetch daily statistics" });
  }
};

export const getWeeklyReport = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized weekly report request");
      return res.status(401).json({ error: "User not authenticated" });
    }

    logger.info("Weekly report requested", { userId: req.user.id });
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
          timestamp: { $gte: start },
        },
      },
      {
        $group: {
          _id: "$category",
          totalWatchTime: { $sum: "$watchTime" },
        },
      },
      {
        $sort: { totalWatchTime: -1 },
      },
    ]);

    const movingAverage: number[] = [];

    for (let i = 0; i < dailyData.length; i++) {
      const prev1 = dailyData[i - 1]?.distractionScore || 0;
      const prev2 = dailyData[i - 2]?.distractionScore || 0;

      movingAverage.push((dailyData[i].distractionScore + prev1 + prev2) / 3);
    }

    const getRisk = (score: number) => {
      if (score < 0.2) return "LOW";
      if (score < 0.5) return "MODERATE";
      return "HIGH";
    };

    let focusStreak = 0;
    for (let i = dailyData.length - 1; i >= 0; i--) {
      if (dailyData[i].distractionScore < 0.3) {
        focusStreak++;
      } else {
        break;
      }
    }

    const latestScore = dailyData.length > 0 ? dailyData[dailyData.length - 1].distractionScore : 0;

    logger.info("Weekly report computed", {
      userId: req.user.id,
      days: dailyData.length,
      categories: categoryData.length,
      focusStreak,
      latestScore,
    });

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
    logger.error("Weekly report failed", { userId: req.user?.id, error: error.message });
    return res.status(500).json({ error: "Failed to fetch weekly report" });
  }
};

export const logActivity = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized log activity attempt");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { videoId, category, watchTime, isBlockedTopic, wasOverride, mode } = req.body;
    const effectiveMode = mode === "relax" ? "relax" : "study";
    const effectiveIsBlockedTopic = Boolean(isBlockedTopic) || effectiveMode === "relax";
    const effectiveWasOverride = Boolean(wasOverride) || effectiveMode === "relax";

    logger.info("Activity logging requested", {
      userId: req.user.id,
      videoId,
      category,
      mode: effectiveMode,
      watchTime,
      isBlockedTopic: effectiveIsBlockedTopic,
      wasOverride: effectiveWasOverride,
    });

    await UserActivity.create({
      userId: req.user.id,
      videoId,
      category,
      mode: effectiveMode,
      watchTime,
      isBlockedTopic: effectiveIsBlockedTopic,
      wasOverride: effectiveWasOverride,
      timestamp: new Date(),
    });

    if (effectiveWasOverride) {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { distractionsBlocked: 1 },
      });
    }

    logger.info("Activity logged successfully", {
      userId: req.user.id,
      videoId,
      mode: effectiveMode,
      watchTime,
    });
    return res.json({ success: true });
  } catch (error: any) {
    logger.error("Activity logging failed", { userId: req.user?.id, error: error.message });
    return res.status(500).json({ error: "Failed to log activity" });
  }
};
