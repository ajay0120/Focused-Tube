import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Loader,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { searchVideos } from "../api/video";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  category: string;
  isBlocked: boolean;
  wasOverride: boolean;
  mode?: "study" | "relax";
}

type UserMode = "study" | "relax";

const SearchPage = () => {
  const auth = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blockedCount, setBlockedCount] = useState(0);
  const [searchBlocked, setSearchBlocked] = useState(false);
  const [isSavingMode, setIsSavingMode] = useState(false);
  const navigate = useNavigate();
  const currentMode: UserMode = auth?.user?.mode || "study";
  const isRelaxMode = currentMode === "relax";

  const checkIfBlocked = (text: string, disinterests: string[]) => {
    const textLower = text.toLowerCase();
    const keywords = disinterests.map((d) => d.toLowerCase());

    return keywords.some((keyword) => {
      if (textLower.includes(keyword)) return true;

      const words = textLower.match(/\w+/g) || [];
      return words.some(
        (word) =>
          (word.length >= 4 && keyword.includes(word)) ||
          (keyword.length >= 4 && word.includes(keyword)) ||
          word === keyword,
      );
    });
  };

  const filterVideos = (videosToFilter: Video[]) => {
    if (isRelaxMode) {
      return { filtered: videosToFilter, blocked: 0 };
    }

    if (!auth?.user?.disinterests || auth.user.disinterests.length === 0) {
      return { filtered: videosToFilter, blocked: 0 };
    }

    const disinterests = auth.user.disinterests.map((d) => d.toLowerCase());
    let blocked = 0;

    const filtered = videosToFilter.filter((video) => {
      const title = video.title.toLowerCase();
      const description = video.description.toLowerCase();

      const hasDisinterest = disinterests.some(
        (keyword) => title.includes(keyword) || description.includes(keyword),
      );

      if (hasDisinterest) {
        blocked++;
        return false;
      }

      return true;
    });

    return { filtered, blocked };
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (auth?.user?.interests && auth.user.interests.length > 0) {
        setLoading(true);

        try {
          const q = auth.user.interests[0];
          const data = await searchVideos<Video>(q);

          if (data.blockedAll) {
            setRecommendedVideos([]);
            setBlockedCount(isRelaxMode ? 0 : data.blockedCount || 0);
          } else {
            const { filtered, blocked } = filterVideos(data.videos);
            setRecommendedVideos(filtered);
            setBlockedCount(isRelaxMode ? 0 : (data.blockedCount || 0) + blocked);
          }
        } catch (error) {
          console.error("Failed to fetch recommendations", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (auth?.user) {
      fetchRecommendations();
    }
  }, [auth?.user, isRelaxMode]);

  const enrichVideos = (videoList: Video[]) => {
    const disinterests = auth?.user?.disinterests ?? [];

    if (disinterests.length === 0 || isRelaxMode) {
      return videoList.map((video) => ({
        ...video,
        isBlocked: isRelaxMode ? true : video.isBlocked || false,
        wasOverride: isRelaxMode ? true : video.wasOverride || false,
        mode: currentMode,
      }));
    }

    return videoList.map((video) => {
      const blockedByKeyword = disinterests.some(
        (keyword) =>
          video.title.toLowerCase().includes(keyword.toLowerCase()) ||
          video.description.toLowerCase().includes(keyword.toLowerCase()),
      );

      return {
        ...video,
        isBlocked: blockedByKeyword || video.isBlocked || false,
        wasOverride: false,
        mode: currentMode,
      };
    });
  };

  const handleModeChange = async (mode: UserMode) => {
    if (!auth?.updateProfile || mode === currentMode) return;

    setIsSavingMode(true);
    try {
      await auth.updateProfile({ mode });
      setSearchBlocked(false);
      setBlockedCount(0);
    } catch (err) {
      console.error("Failed to update mode", err);
    } finally {
      setIsSavingMode(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearchBlocked(false);

    if (!isRelaxMode && auth?.user?.disinterests) {
      const isBlocked = checkIfBlocked(query, auth.user.disinterests);

      if (isBlocked) {
        setSearchBlocked(true);
        setLoading(false);
        setVideos([]);
        auth?.incrementBlockedCount();
        return;
      }
    }

    try {
      const data = await searchVideos<Video>(query);
      const enriched = enrichVideos(data.videos);
      setVideos(enriched);

      if (data.blockedAll) {
        setBlockedCount(isRelaxMode ? 0 : data.blockedCount || 0);
        return;
      }

      const { blocked } = filterVideos(data.videos);
      setBlockedCount(isRelaxMode ? 0 : (data.blockedCount || 0) + blocked);
    } catch (err) {
      setError("Failed to fetch videos. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const blockedBanner =
    !isRelaxMode && blockedCount > 0 ? (
      <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-200 animate-fade-in">
        <BrainCircuit className="h-4 w-4" />
        {blockedCount} video{blockedCount !== 1 ? "s" : ""}{" "}
        {blockedCount !== 1 ? "were" : "was"} hidden because{" "}
        {blockedCount !== 1 ? "they" : "it"} matched your disinterests.
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <Navbar />

      <main className="container relative mx-auto mt-16 px-4 py-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-6rem] top-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl animate-float-slow" />
          <div className="absolute right-[-4rem] top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-float-medium" />
        </div>

        <div className="relative mx-auto mb-8 max-w-5xl rounded-[32px] border border-white/10 bg-slate-900/80 px-5 py-8 text-center shadow-2xl shadow-black/20 backdrop-blur sm:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            Discovery
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-cyan-200 via-white to-blue-300 bg-clip-text text-4xl font-black text-transparent">
            Find Focused Content
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-slate-300">
            {isRelaxMode
              ? "Relax mode shows everything you search for, without disinterest filtering."
              : "Search for educational videos without the distractions."}
          </p>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left">
              <p className="text-sm text-slate-400">Search Tip</p>
              <p className="mt-1 text-sm text-white">
                Try topics like React hooks, system design, or calculus.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left">
              <p className="text-sm text-slate-400">Current Filter</p>
              <p className="mt-1 text-sm text-white">
                {isRelaxMode
                  ? "Relax mode is showing full results."
                  : "Study mode is hiding distractions."}
              </p>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
              <button
                type="button"
                onClick={() => void handleModeChange("study")}
                disabled={isSavingMode}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  !isRelaxMode
                    ? "bg-emerald-500 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Study Mode
              </button>
              <button
                type="button"
                onClick={() => void handleModeChange("relax")}
                disabled={isSavingMode}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  isRelaxMode
                    ? "bg-amber-500 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Relax Mode
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative mx-auto max-w-2xl">
            <input
              type="text"
              placeholder="What do you want to learn today?"
              className="w-full rounded-full border border-white/10 bg-slate-950/80 px-6 py-4 pl-14 text-white shadow-lg outline-none transition duration-200 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-5 top-4 h-6 w-6 text-slate-400" />
            <button
              type="submit"
              className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-medium text-white transition duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
            >
              Search
            </button>
          </form>
        </div>

        {searchBlocked ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-[28px] border border-red-500/20 bg-slate-900/80 p-10 text-center animate-fade-in-up">
            <div className="mb-6 rounded-full bg-red-500/10 p-6 ring-1 ring-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
              <ShieldAlert className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Content Blocked
            </h2>
            <p className="mb-8 max-w-lg text-lg text-slate-300">
              This search matches topics in your disinterests list. We blocked
              these results to help you avoid distractions.
            </p>
            <button
              onClick={() => {
                setSearchBlocked(false);
                setQuery("");
              }}
              className="rounded-full border border-white/10 bg-white/5 px-8 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Clear Search
            </button>
          </div>
        ) : loading ? (
          <div className="mt-12 flex justify-center">
            <Loader className="h-12 w-12 animate-spin text-cyan-400" />
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-red-400">{error}</div>
        ) : videos.length > 0 ? (
          <>
            <h2 className="mb-6 text-2xl font-bold animate-fade-in-up">
              Search Results
            </h2>
            {blockedBanner}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => navigate(`/watch/${video.id}`, { state: video })}
                />
              ))}
            </div>
          </>
        ) : recommendedVideos.length > 0 ? (
          <>
            <div className="mb-8 mt-12 text-center animate-fade-in-up">
              <h2 className="text-2xl font-bold">Recommended for You</h2>
              <p className="mt-2 text-slate-400">
                Personalized videos based on your interests.
              </p>
            </div>
            {blockedBanner}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recommendedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => navigate(`/watch/${video.id}`, { state: video })}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-12 rounded-[28px] border border-white/10 bg-slate-900/80 p-10 text-center animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white">Start with a topic</h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-300">
              Search for something you want to learn, or add more interests to
              get better recommendations.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

const VideoCard = ({
  video,
  onClick,
}: {
  video: Video;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="group cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/80 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-cyan-500/10"
  >
    <img
      src={video.thumbnail}
      alt={video.title}
      className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
    />

    <div className="p-6">
      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white transition group-hover:text-cyan-300">
        {video.title}
      </h3>
      <p className="mb-4 text-sm text-slate-400">{video.channelTitle}</p>
      <p className="line-clamp-3 text-sm text-slate-500">{video.description}</p>
    </div>
  </div>
);

export default SearchPage;
