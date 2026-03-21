import YouTube from "react-youtube";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { logActivity } from "../api/analytics";

export interface WatchVideo {
  id: string;
  title?: string;
  category?: string;
  isBlocked?: boolean;
  wasOverride?: boolean;
  mode?: "study" | "relax";
}

export interface VideoPlayerHandle {
  flushWatchProgress: () => Promise<void>;
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, { video: WatchVideo }>(({ video }, ref) => {
  const watchTimeRef = useRef(0);
  const lastPlayRef = useRef<number | null>(null);
  const hasLoggedRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (lastPlayRef.current) {
      watchTimeRef.current += (Date.now() - lastPlayRef.current) / 1000;
      lastPlayRef.current = null;
    }
  }, []);

  const onPlay = () => {
    lastPlayRef.current = Date.now();
  };

  const onPause = () => {
    stopTimer();
  };

  const flushWatchProgress = useCallback(async () => {
    stopTimer();

    if (hasLoggedRef.current || watchTimeRef.current <= 5) {
      return;
    }

    hasLoggedRef.current = true;

    try {
      await logActivity({
        videoId: video.id,
        category: video.category || "Unknown",
        watchTime: watchTimeRef.current,
        isBlockedTopic: video.isBlocked || false,
        wasOverride: video.wasOverride || false,
        mode: video.mode || "study",
      });
      watchTimeRef.current = 0;
    } catch (error) {
      hasLoggedRef.current = false;
      throw error;
    }
  }, [stopTimer, video]);

  useImperativeHandle(ref, () => ({
    flushWatchProgress,
  }), [flushWatchProgress]);

  useEffect(() => {
    return () => {
      void flushWatchProgress();
    };
  }, [flushWatchProgress]);

  return (
    <div className="flex justify-center">
      <YouTube
        videoId={video.id}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={() => {
          void flushWatchProgress();
        }}
        className="rounded-xl overflow-hidden"
      />
    </div>
  );
});

export default VideoPlayer;
