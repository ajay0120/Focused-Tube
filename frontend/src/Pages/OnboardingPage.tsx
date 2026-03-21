import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Sparkles, ShieldBan} from "lucide-react";

const OnboardingPage = () => {
  const [interests, setInterests] = useState<string[]>([]);
  const [disinterests, setDisinterests] = useState<string[]>([]);
  const [highlightedInterest, setHighlightedInterest] = useState<string | null>(
    null,
  );
  const [highlightedDisinterest, setHighlightedDisinterest] = useState<
    string | null
  >(null);
  const [currentInterest, setCurrentInterest] = useState("");
  const [currentDisinterest, setCurrentDisinterest] = useState("");
  const [age, setAge] = useState<number | "">("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    // If user exists and onboarding already completed, don't show onboarding
    if (auth?.user) {
      if (auth.user.onboardingCompleted) {
        navigate("/profile");
      }
    }
  }, [auth?.user, navigate]);

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      currentInterest &&
      interests.length < 10 &&
      !interests.includes(currentInterest)
    ) {
      setInterests([...interests, currentInterest]);
      setHighlightedInterest(currentInterest);
      window.setTimeout(() => setHighlightedInterest(null), 1200);
      setCurrentInterest("");
    }
  };

  const handleAddDisinterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      currentDisinterest &&
      disinterests.length < 10 &&
      !disinterests.includes(currentDisinterest)
    ) {
      setDisinterests([...disinterests, currentDisinterest]);
      setHighlightedDisinterest(currentDisinterest);
      window.setTimeout(() => setHighlightedDisinterest(null), 1200);
      setCurrentDisinterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const removeDisinterest = (disinterest: string) => {
    setDisinterests(disinterests.filter((d) => d !== disinterest));
  };

  const handleSubmit = async () => {
    if (interests.length > 0 && disinterests.length > 0 && age) {
      try {
        await auth?.updateProfile({
          interests,
          disinterests,
          age: Number(age),
          onboardingCompleted: true,
        });
        navigate("/profile");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
                Feed Setup
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white">
                Shape your FocusedTube feed
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Add what you want more of and what you want filtered out. We
                will use these preferences to tune your recommendations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:w-[320px]">
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3">
                <p className="text-slate-300">Interests</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {interests.length}
                  <span className="ml-1 text-sm font-medium text-blue-200">
                    /10
                  </span>
                </p>
              </div>
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3">
                <p className="text-slate-300">Blocked Topics</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {disinterests.length}
                  <span className="ml-1 text-sm font-medium text-red-200">
                    /10
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-cyan-400/15 p-2 text-cyan-200">
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">
                  Quick example
                </p>
                <div className="flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:flex-wrap">
                  <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-blue-100">
                    Coding -{'>'} more programming videos
                  </span>
                  <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-red-100">
                    Politics -{'>'} hidden from your feed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Enter your age"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="group rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 via-slate-950/60 to-slate-950/80 p-5 transition duration-300 hover:border-blue-400/35 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                      <Sparkles className="h-3.5 w-3.5" />
                      Show More
                    </div>
                    <h3 className="text-xl font-bold text-white">Interests</h3>
                    <p className="mt-1 text-sm text-slate-300">
                      Add topics you enjoy and we&apos;ll recommend more related
                      videos.
                    </p>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {interests.length}/10
                  </span>
                </div>

                <div className="mb-4 rounded-2xl border border-blue-400/15 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-200/80">
                    Example
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Coding, Design, AI, Music
                  </p>
                </div>

                <form
                  onSubmit={handleAddInterest}
                  className="mb-4 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="text"
                    value={currentInterest}
                    onChange={(e) => setCurrentInterest(e.target.value)}
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
                    placeholder="Type a topic you like"
                  />
                  <button
                    type="submit"
                    disabled={interests.length >= 10}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:translate-y-[-1px] hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add Interest
                  </button>
                </form>

                <div className="flex min-h-[3rem] flex-wrap gap-2">
                  {interests.length > 0 ? (
                    interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-300 ${
                          highlightedInterest === interest
                            ? "scale-105 border-blue-300 bg-blue-500 text-white shadow-lg shadow-blue-500/30 animate-pulse"
                            : "border-blue-400/15 bg-blue-500/10 text-blue-100"
                        }`}
                      >
                        {interest}
                        <button
                          onClick={() => removeInterest(interest)}
                          className="text-current/80 transition hover:text-white"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No interests yet. Add one to start personalizing.
                    </p>
                  )}
                </div>
              </div>

              <div className="group rounded-3xl border border-red-400/15 bg-gradient-to-br from-red-500/10 via-slate-950/60 to-slate-950/80 p-5 transition duration-300 hover:border-red-400/35 hover:shadow-lg hover:shadow-red-500/10">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-100">
                      <ShieldBan className="h-3.5 w-3.5" />
                      Hide More
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Disinterests
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">
                      Add topics you want filtered, blocked, or shown less
                      often.
                    </p>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {disinterests.length}/10
                  </span>
                </div>

                <div className="mb-4 rounded-2xl border border-red-400/15 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-red-200/80">
                    Example
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Politics, Clickbait, Gossip
                  </p>
                </div>

                <form
                  onSubmit={handleAddDisinterest}
                  className="mb-4 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="text"
                    value={currentDisinterest}
                    onChange={(e) => setCurrentDisinterest(e.target.value)}
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-red-400/60 focus:ring-2 focus:ring-red-400/20"
                    placeholder="Type a topic to block"
                  />
                  <button
                    type="submit"
                    disabled={disinterests.length >= 10}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:translate-y-[-1px] hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add Disinterest
                  </button>
                </form>

                <div className="flex min-h-[3rem] flex-wrap gap-2">
                  {disinterests.length > 0 ? (
                    disinterests.map((disinterest, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-300 ${
                          highlightedDisinterest === disinterest
                            ? "scale-105 border-red-300 bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                            : "border-red-400/15 bg-red-500/10 text-red-100"
                        }`}
                      >
                        {disinterest}
                        <button
                          onClick={() => removeDisinterest(disinterest)}
                          className="text-current/80 transition hover:text-white"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No blocked topics yet. Add one to keep your feed cleaner.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">
                  Finish personalizing your feed
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Add at least 1 interest and 1 disinterest to continue.
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={
                  !age || interests.length === 0 || disinterests.length === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-3.5 text-base font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Complete Setup
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
