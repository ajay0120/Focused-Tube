import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoPlayer, { type VideoPlayerHandle, type WatchVideo } from "../components/VideoPlayer";
import Navbar from "../components/Navbar";

const Watch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const playerRef = useRef<VideoPlayerHandle>(null);
  const video = location.state as WatchVideo | undefined;

  const handleBack = async () => {
    try {
      await playerRef.current?.flushWatchProgress();
    } catch (error) {
      console.error("Failed to log partial watch progress", error);
    } finally {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/search");
      }
    }
  };

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Video not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="animate-fade-in-up rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-lg sm:p-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </button>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300/80">
                Watch Mode
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {video.title || "Focused Video"}
              </h1>
              <p className="mt-2 text-sm text-gray-400 sm:text-base">
                Stay on the lesson and head back to search whenever you're ready.
              </p>
            </div>
          </div>

          <div className="animate-fade-in rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/70">
              <VideoPlayer ref={playerRef} video={video} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
