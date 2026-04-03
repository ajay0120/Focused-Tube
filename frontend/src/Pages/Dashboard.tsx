import React, { useEffect, useState } from "react";
import { Activity, ArrowLeft, Flame, ShieldAlert, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getDailyStatistics, getWeeklyReport } from "../api/analytics";
import DistractionScoreChart from "../components/charts/DistractionScoreChart";
import MovingAverageChart from "../components/charts/MovingAverageChart";
import OverridesChart from "../components/charts/OverridesChart";
import TimeByCategoryChart from "../components/charts/TimeByCategoryChart";
import ProductivityRing from "../components/ProductivityRing";
import Navbar from "../components/Navbar";

const Dashboard: React.FC = () => {
  const [daily, setDaily] = useState<any>(null);
  const [weekly, setWeekly] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const [d, w] = await Promise.all([
          getDailyStatistics(),
          getWeeklyReport(),
        ]);
        setDaily(d);
        setWeekly(w);
      } catch (err: any) {
        setError(err.message || "Unable to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getRiskStyle = (risk: string) => {
    if (risk === "LOW") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    }
    if (risk === "MODERATE") {
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    }
    return "border-red-500/30 bg-red-500/10 text-red-200";
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}hr ${m}min` : `${m} min`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-slate-300">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-gray-200">
      <Navbar />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
          <Link
            to="/profile"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-purple-200">
            <Sparkles className="h-3.5 w-3.5" />
            Analytics
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Analytics Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Behavioral insights powered by semantic filtering and activity
            modeling.
          </p>
        </div>

        {daily && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total Watch Time"
              value={formatTime(daily.totalWatchTime)}
            />
            <KpiCard
              title="Productive Time"
              value={formatTime(daily.productiveTime)}
              color="text-emerald-300"
            />
            <KpiCard
              title="Distracting Time"
              value={formatTime(daily.distractingTime)}
              color="text-red-300"
            />
            <KpiCard
              title="Distraction Score"
              value={`${Math.round((daily.distractionScore || 0) * 100)}%`}
              color="text-purple-300"
            />
          </div>
        )}

        {weekly && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <GlassCard>
                <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3 text-purple-200">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-400">Current Risk Level</p>
                <div
                  className={`mt-4 inline-flex rounded-full border px-5 py-2 text-sm font-semibold ${getRiskStyle(
                    weekly.currentRiskLevel,
                  )}`}
                >
                  {weekly.currentRiskLevel}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3 text-orange-200">
                  <Flame className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-400">Focus Streak</p>
                <div className="mt-4 text-4xl font-bold text-orange-300">
                  {weekly.focusStreak}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Consecutive disciplined days
                </p>
              </GlassCard>

              <GlassCard>
                <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3 text-purple-200">
                  <Activity className="h-5 w-5" />
                </div>
                <p className="mb-6 text-sm text-slate-400">
                  Productivity Score
                </p>
                <div className="flex justify-center">
                  <ProductivityRing percentage={(1 - daily.distractionScore) * 100} />
                </div>
              </GlassCard>
            </div>

            <div className="space-y-8">
              <GlassCard>
                <SectionTitle title="Weekly Distraction Score Trend" />
                <DistractionScoreChart
                  data={weekly.distractionTrend.map((item: any) => ({
                    date: item._id,
                    distractionScore: item.distractionScore,
                  }))}
                />
              </GlassCard>

              {/* <GlassCard>
                <SectionTitle title="3-Day Moving Average" />
                <MovingAverageChart
                  labels={weekly.distractionTrend.map((d: any) => d._id)}
                  data={weekly.movingAverage}
                />
              </GlassCard> */}

              <GlassCard>
                <SectionTitle title="Overrides Per Day" />
                <OverridesChart
                  data={weekly.overrideFrequency.map((item: any) => ({
                    date: item._id,
                    count: item.count,
                  }))}
                />
              </GlassCard>

              <GlassCard>
                <SectionTitle title="Time by Category" />
                <TimeByCategoryChart data={weekly.timeByCategory} />
              </GlassCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const GlassCard = ({ children }: any) => (
  <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/15 backdrop-blur transition duration-300 hover:border-purple-400/20 hover:shadow-purple-500/5 sm:p-8">
    {children}
  </div>
);

const KpiCard = ({
  title,
  value,
  color = "text-white",
}: {
  title: string;
  value: string;
  color?: string;
}) => (
  <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:shadow-purple-500/5">
    <p className="text-sm text-slate-400">{title}</p>
    <h3 className={`mt-3 text-3xl font-bold ${color}`}>{value}</h3>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="mb-6 text-xl font-semibold tracking-tight text-white">
    {title}
  </h2>
);

export default Dashboard;
