import React, { useEffect, useState } from "react";
import { getDailyStatistics, getWeeklyReport } from "../api/analytics";
import DistractionScoreChart from "../components/charts/DistractionScoreChart";
import OverridesChart from "../components/charts/OverridesChart";
import TimeByCategoryChart from "../components/charts/TimeByCategoryChart";
import MovingAverageChart from "../components/charts/MovingAverageChart";
import ProductivityRing from "../components/ProductivityRing";

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
    if (risk === "LOW")
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
    if (risk === "MODERATE")
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40";
    return "bg-red-500/20 text-red-400 border border-red-500/40";
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}hr ${m}min` : `${m} min`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Loading analytics...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200 p-10 space-y-14">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400 mt-3">
          Behavioral insights powered by semantic filtering and activity modeling.
        </p>
      </div>

      {/* Daily KPIs */}
      {daily && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Total Watch Time" value={formatTime(daily.totalWatchTime)} />
          <KpiCard title="Productive Time" value={formatTime(daily.productiveTime)} color="text-emerald-400" />
          <KpiCard title="Distracting Time" value={formatTime(daily.distractingTime)} color="text-red-400" />
          <KpiCard title="Blocked Attempts" value={formatTime(daily.blockedAttempts)} color="text-yellow-400" />
        </div>
      )}

      {weekly && (
        <>
          {/* Risk + Streak + Productivity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center text-center">

            <GlassCard>
              <p className="text-sm text-gray-400 mb-4 text-center">
                Current Risk Level
              </p>

              <div className="flex justify-center">
                <div
                  className={`px-6 py-2 rounded-full text-sm font-semibold ${getRiskStyle(
                    weekly.currentRiskLevel
                  )}`}
                >
                  {weekly.currentRiskLevel}
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <p className="text-sm text-gray-400">Focus Streak</p>
              <div className="text-4xl font-bold text-orange-400 mt-4">
                🔥 {weekly.focusStreak}
              </div>
              <p className="text-xs text-gray-500 mt-1">Consecutive disciplined days</p>
            </GlassCard>

            <GlassCard>
              <p className="text-sm text-gray-400 mb-6 text-center">
                Productivity Score
              </p>
              <div className="flex justify-center">
                <ProductivityRing percentage={weekly.productivityScore * 100} />
              </div>
            </GlassCard>

          </div>

          {/* Charts */}
          <div className="space-y-10">

            <GlassCard>
              <SectionTitle title="Weekly Distraction Score Trend" />
              <DistractionScoreChart
                data={weekly.distractionTrend.map((item: any) => ({
                  date: item._id,
                  distractionScore: item.distractionScore,
                }))}
              />
            </GlassCard>

            <GlassCard>
              <SectionTitle title="3-Day Moving Average" />
              <MovingAverageChart
                labels={weekly.distractionTrend.map((d: any) => d._id)}
                data={weekly.movingAverage}
              />
            </GlassCard>

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
  );
};

/* 🔹 Reusable Glass Card */
const GlassCard = ({ children }: any) => (
  <div className="
    rounded-3xl 
    bg-white/5 
    backdrop-blur-lg 
    border border-white/10 
    shadow-xl 
    p-8
    hover:shadow-2xl 
    transition-all 
    duration-300
  ">
    {children}
  </div>
);

/* 🔹 KPI Card */
const KpiCard = ({ title, value, color = "text-white" }: any) => (
  <div className="
    rounded-3xl 
    bg-white/5 
    backdrop-blur-lg 
    border border-white/10 
    shadow-lg 
    p-6 
    hover:scale-[1.03] 
    transition-all 
    duration-300
  ">
    <p className="text-sm text-gray-400">{title}</p>
    <h3 className={`text-3xl font-bold mt-3 ${color}`}>
      {value}
    </h3>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-xl font-semibold text-white mb-6 tracking-tight">
    {title}
  </h2>
);

export default Dashboard;