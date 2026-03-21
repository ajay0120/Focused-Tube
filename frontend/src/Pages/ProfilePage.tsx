import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  User,
  Clock,
  Shield,
  Loader,
  Edit2,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { searchVideos } from "../api/video";
import { getDailyStatistics } from "../api/analytics";
import { Link } from "react-router-dom";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const [recommended, setRecommended] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusTime, setFocusTime] = useState("0h 0m");
  const [isEditing, setIsEditing] = useState(false);
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [highlightedInterest, setHighlightedInterest] = useState<number | null>(
    null,
  );
  const [newInterest, setNewInterest] = useState("");
  const [isEditingDisinterests, setIsEditingDisinterests] = useState(false);
  const [editDisinterests, setEditDisinterests] = useState<string[]>([]);
  const [highlightedDisinterest, setHighlightedDisinterest] = useState<
    number | null
  >(null);
  const [newDisinterest, setNewDisinterest] = useState("");

  useEffect(() => {
    if (auth?.refetchUser) {
      auth.refetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchDailyStatistics = async () => {
      try {
        const daily = await getDailyStatistics();
        const productiveSeconds = Number(daily?.productiveTime || 0);
        const hours = Math.floor(productiveSeconds / 3600);
        const minutes = Math.floor((productiveSeconds % 3600) / 60);
        setFocusTime(`${hours}h ${minutes}m`);
      } catch (error) {
        console.error("Failed to fetch daily statistics", error);
      }
    };

    if (auth?.user) {
      fetchDailyStatistics();
    }
  }, [auth?.user]);
  useEffect(() => {
    if (auth?.user?.interests) {
      setEditInterests(auth.user.interests);
    }
    if (auth?.user?.disinterests) {
      setEditDisinterests(auth.user.disinterests);
    }
  }, [auth?.user]);

  useEffect(() => {
    if (auth?.user?.interests && auth.user.interests.length > 0) {
      const fetchRecommended = async () => {
        setLoading(true);
        try {
          // Search for the first interest for now
          const query = auth?.user?.interests?.[0] || "programming";
          const data = await searchVideos<Video>(query);
          setRecommended(data.videos.slice(0, 4));
        } catch (error) {
          console.error("Failed to fetch recommendations", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecommended();
    }
  }, [auth?.user?.interests]);

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      const nextIndex = editInterests.length;
      setEditInterests([...editInterests, newInterest.trim()]);
      setHighlightedInterest(nextIndex);
      window.setTimeout(() => setHighlightedInterest(null), 1200);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index: number) => {
    setEditInterests(editInterests.filter((_, i) => i !== index));
  };

  const handleSaveInterests = async () => {
    if (auth?.updateProfile) {
      try {
        await auth.updateProfile({ interests: editInterests });
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update interests", error);
      }
    }
  };

  const handleAddDisinterest = () => {
    if (newDisinterest.trim()) {
      const nextIndex = editDisinterests.length;
      setEditDisinterests([...editDisinterests, newDisinterest.trim()]);
      setHighlightedDisinterest(nextIndex);
      window.setTimeout(() => setHighlightedDisinterest(null), 1200);
      setNewDisinterest("");
    }
  };

  const handleRemoveDisinterest = (index: number) => {
    setEditDisinterests(editDisinterests.filter((_, i) => i !== index));
  };

  const handleSaveDisinterests = async () => {
    if (auth?.updateProfile) {
      try {
        await auth.updateProfile({ disinterests: editDisinterests });
        setIsEditingDisinterests(false);
      } catch (error) {
        console.error("Failed to update disinterests", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <Navbar />

      <main className="container relative mx-auto mt-16 px-4 py-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8rem] top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl animate-float-slow" />
          <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-float-medium" />
          <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Header Section */}
          <div className="mb-8 rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Profile Hub
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-tr from-cyan-500 to-indigo-600 text-4xl font-bold shadow-lg shadow-blue-500/25">
                  {auth?.user?.name ? (
                    auth.user.name.charAt(0).toUpperCase()
                  ) : (
                    <User />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white">
                    {auth?.user?.name}
                  </h1>
                  <p className="text-slate-400">
                    @{auth?.user?.username || "user"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {auth?.user?.role || "Member"}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs ${
                      auth?.user?.mode === "relax"
                        ? "border border-amber-500/20 bg-amber-500/10 text-amber-200"
                        : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                    }`}>
                      {auth?.user?.mode === "relax" ? "Relax Mode" : "Study Mode"}
                    </span>
                    {auth?.user?.age && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        Age: {auth.user.age}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:ml-auto lg:max-w-lg">
                <div className="rounded-3xl border border-cyan-400/15 bg-cyan-500/10 p-4">
                  <p className="text-sm text-slate-300">Total Focus Time</p>
                  <p className="mt-2 text-2xl font-bold text-white">{focusTime}</p>
                </div>
                <div className="rounded-3xl border border-blue-400/15 bg-blue-500/10 p-4">
                  <p className="text-sm text-slate-300">Distractions Blocked</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {auth?.user?.distractionsBlocked || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">
                  Your feed is shaped by what you add here.
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Update interests to see more of what matters and block topics
                  that break your focus.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
              >
                View Analytics
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-emerald-500/10 p-3">
                  <Clock className="h-8 w-8 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-sm text-slate-400">Focus Time</h3>
                  <p className="text-2xl font-bold text-white">{focusTime}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-cyan-500/10 p-3">
                  <Shield className="h-8 w-8 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-sm text-slate-400">Distractions Blocked</h3>
                  <p className="text-2xl font-bold text-white">
                    {auth?.user?.distractionsBlocked || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interests Section */}
          <div className="mb-8 rounded-[30px] border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-black/15 backdrop-blur">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Your Interests</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Topics that help us recommend more relevant videos.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
              >
                <Edit2 className="w-4 h-4 text-cyan-300" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {auth?.user?.interests?.map((interest: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-cyan-400/15 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100"
                >
                  {interest}
                </span>
              )) || <p className="text-slate-500">No interests added yet.</p>}
            </div>

            {/* Edit Modal */}
          </div>

          {/* Disinterests Section */}
          <div className="mb-8 rounded-[30px] border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-black/15 backdrop-blur">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Your Disinterests</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Topics that should be blocked or shown less often.
                </p>
              </div>
              <button
                onClick={() => setIsEditingDisinterests(true)}
                className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
              >
                <Edit2 className="w-4 h-4 text-red-300" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {auth?.user?.disinterests?.map(
                (disinterest: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-full border border-red-400/15 bg-red-500/10 px-4 py-2 text-sm text-red-100"
                  >
                    {disinterest}
                  </span>
                ),
              ) || <p className="text-slate-500">No disinterests added yet.</p>}
            </div>

            {/* Edit Disinterests Modal */}
          </div>

          {/* Recommended Section - NEW */}
          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-black/15 backdrop-blur">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Recommended for You</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Fresh picks based on the topics you follow.
                </p>
              </div>
              <Link
                to="/recommended"
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-white/10 hover:text-cyan-200"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader className="h-8 w-8 animate-spin text-cyan-400" />
              </div>
            ) : recommended.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {recommended.map((video) => (
                  <div
                    key={video.id}
                    className="group overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/70 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-cyan-500/10"
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-24 w-32 object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="p-3">
                        <h3 className="line-clamp-2 text-sm font-bold text-white transition group-hover:text-cyan-300">
                          {video.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                          {video.channelTitle}
                        </p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">
                Add interests to see recommendations.
              </p>
            )}
          </div>
        </div>
      </main>
      {isEditing &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[30px] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-black/40">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Edit Interests</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 transition hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4 rounded-2xl border border-cyan-400/15 bg-cyan-500/10 px-4 py-3">
                <p className="text-sm text-cyan-100">
                  Add topics to show more related videos in your feed.
                </p>
              </div>
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                Type a topic and click Add Interest
              </p>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddInterest()}
                  placeholder="Type an interest"
                  className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
                <button
                  onClick={handleAddInterest}
                  className="whitespace-nowrap rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-medium text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
                >
                  Add Interest
                </button>
              </div>
              <div className="mb-6 flex max-h-60 flex-wrap gap-2 overflow-y-auto">
                {editInterests.map((interest, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-all duration-300 ${
                      highlightedInterest === i
                        ? "scale-105 bg-cyan-500 text-white ring-2 ring-cyan-300 shadow-lg shadow-cyan-500/30"
                        : "border border-cyan-400/15 bg-cyan-500/10 text-cyan-100"
                    }`}
                  >
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(i)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={handleSaveInterests}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white transition hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>,
          document.body,
        )}
      {isEditingDisinterests &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[30px] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-black/40">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Edit Disinterests</h3>
                <button
                  onClick={() => setIsEditingDisinterests(false)}
                  className="text-slate-400 transition hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4 rounded-2xl border border-red-400/15 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-100">
                  Add topics to block or hide related videos from your feed.
                </p>
              </div>
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                Type a topic and click Add Disinterest
              </p>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newDisinterest}
                  onChange={(e) => setNewDisinterest(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddDisinterest()
                  }
                  placeholder="Type a disinterest"
                  className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-red-400/50 focus:ring-2 focus:ring-red-400/20"
                />
                <button
                  onClick={handleAddDisinterest}
                  className="whitespace-nowrap rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3 font-medium text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20"
                >
                  Add Disinterest
                </button>
              </div>
              <div className="mb-6 flex max-h-60 flex-wrap gap-2 overflow-y-auto">
                {editDisinterests.map((interest, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-all duration-300 ${
                      highlightedDisinterest === i
                        ? "scale-105 bg-red-500 text-white ring-2 ring-red-300 shadow-lg shadow-red-500/30"
                        : "border border-red-400/15 bg-red-500/10 text-red-100"
                    }`}
                  >
                    {interest}
                    <button
                      onClick={() => handleRemoveDisinterest(i)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={handleSaveDisinterests}
                className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 py-3 font-bold text-white transition hover:scale-[1.01] hover:shadow-lg hover:shadow-red-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default ProfilePage;



