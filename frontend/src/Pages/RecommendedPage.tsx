import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Loader, Play, Sparkles } from "lucide-react";
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
}

const RecommendedPage = () => {
  const auth = useContext(AuthContext);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (auth?.user?.interests && auth.user.interests.length > 0) {
        setLoading(true);
        try {
          const q = auth.user.interests[0];
          const data = await searchVideos<Video>(q);
          setVideos(data.videos);
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
  }, [auth?.user]);

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <Navbar />

      <main className="container relative mx-auto mt-16 px-4 py-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-6rem] top-0 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl animate-float-medium" />
          <div className="absolute left-[-4rem] top-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl animate-float-slow" />
        </div>

        <div className="relative mb-8 rounded-[32px] border border-white/10 bg-slate-900/80 px-5 py-8 shadow-2xl shadow-black/20 backdrop-blur sm:px-8">
          <button
            onClick={() => navigate("/profile")}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-purple-200">
              <Sparkles className="h-3.5 w-3.5" />
              Personalized Feed
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Recommended For You
            </h1>
            <p className="mt-3 text-slate-300">
              Curated content based on your interests, with a cleaner visual
              browsing flow.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Loader className="h-12 w-12 animate-spin text-purple-400" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/80 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-purple-500/10"
              >
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
                    <div className="rounded-full bg-white/10 p-4 backdrop-blur">
                      <Play className="h-10 w-10 fill-current text-white" />
                    </div>
                  </div>
                </a>
                <div className="p-5">
                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white group-hover:text-purple-300">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span className="truncate pr-3">{video.channelTitle}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 py-20 text-center">
            <p className="text-xl text-slate-300">No recommendations found.</p>
            <p className="mt-2 text-slate-500">
              Try adding more interests to your profile.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-6 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-600 px-6 py-2 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
            >
              Manage Interests
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecommendedPage;
