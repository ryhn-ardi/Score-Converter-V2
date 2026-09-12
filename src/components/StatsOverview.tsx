import React from 'react';
import {
  TrendingUp,
  Award,
  Users,
  Target,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { SummaryStats } from '../types';

interface StatsOverviewProps {
  stats: SummaryStats;
  kkm: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, kkm }) => {
  if (stats.count === 0) {
    return null;
  }

  const passingRateGain = Number((stats.scaledPassingRate - stats.rawPassingRate).toFixed(1));

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Comparative Statistics (Before vs. After)
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          N = {stats.count} Students | KKM = {kkm}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: PASSING RATE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Passing Rate (Tuntas KKM)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.scaledPassingRate}%
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              ({stats.scaledPassingCount} / {stats.count})
            </span>
          </div>

          {/* Before comparison & Delta */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">
              Raw: {stats.rawPassingRate}% ({stats.rawPassingCount} passed)
            </span>
            {passingRateGain > 0 ? (
              <span className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md text-[11px]">
                +{passingRateGain}% ({stats.gainPassingCount} new)
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">Unchanged</span>
            )}
          </div>

          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.scaledPassingRate)}%` }}
            />
          </div>
        </div>

        {/* CARD 2: MEAN / AVERAGE SCORE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Class Mean (Rata-rata)
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.scaledMean}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">pts</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              Raw: {stats.rawMean} <ArrowRight className="w-3 h-3 text-slate-400" />
            </span>
            <span className="inline-flex items-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded-md text-[11px]">
              {stats.avgGain >= 0 ? `+${stats.avgGain}` : stats.avgGain} avg
            </span>
          </div>

          {/* Visual Mini Comparison Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3 relative">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.scaledMean)}%` }}
            />
          </div>
        </div>

        {/* CARD 3: MIN & MAX RANGE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Score Range (Min – Max)
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Target className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.scaledMin} – {stats.scaledMax}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">
              Raw Range: {stats.rawMin} – {stats.rawMax}
            </span>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              Min Boost: +{(stats.scaledMin - stats.rawMin).toFixed(1)}
            </span>
          </div>

          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3 relative">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{
                marginLeft: `${Math.min(100, stats.scaledMin)}%`,
                width: `${Math.max(4, Math.min(100, stats.scaledMax - stats.scaledMin))}%`,
              }}
            />
          </div>
        </div>

        {/* CARD 4: MEDIAN & STANDARD DEVIATION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Median &amp; Spread (Std Dev)
            </span>
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-2 font-mono">
            <div>
              <span className="text-xs text-slate-400 block -mb-1">Median</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.scaledMedian}
              </span>
            </div>
            <div className="text-slate-300 dark:text-slate-700 text-2xl font-light">/</div>
            <div>
              <span className="text-xs text-slate-400 block -mb-1">Std Dev (σ)</span>
              <span className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-300">
                {stats.scaledStdDev}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">
              Raw: Med {stats.rawMedian} (σ={stats.rawStdDev})
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Distribution spread
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (stats.scaledStdDev / 30) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
