import YouTube from "react-youtube";
import { useRef } from "react";
import { logActivity } from "../api/analytics";

export const VideoPlayer = ({ video }: any) => {
  const watchTimeRef = useRef(0);
  const lastPlayRef = useRef<number | null>(null);

  const onPlay = () => {
    lastPlayRef.current = Date.now();
  };

  const onPause = () => {
    if (lastPlayRef.current) {
      watchTimeRef.current +=
        (Date.now() - lastPlayRef.current) / 1000;
      lastPlayRef.current = null;
    }
  };

  const finalizeWatch = async () => {
    if (lastPlayRef.current) {
      watchTimeRef.current +=
        (Date.now() - lastPlayRef.current) / 1000;
      lastPlayRef.current = null;
    }

    if (watchTimeRef.current > 5) {
      await logActivity({
        videoId: video.id,
        category: video.category || "Unknown",
        watchTime: watchTimeRef.current,
        isBlockedTopic: video.isBlocked || false,
        wasOverride: video.wasOverride || false,
      });
    }

    watchTimeRef.current = 0;
  };

  return (
    <div className="flex justify-center">
      <YouTube
        videoId={video.id}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={finalizeWatch}
        className="rounded-xl overflow-hidden"
      />
    </div>
  );
};

export default VideoPlayer;