import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  Filler,
} from 'chart.js';
import { BarChart3, LineChart, Info } from 'lucide-react';
import { ScalingConfig, StudentGrade } from '../types';
import { computeScaledValue } from '../utils/gradeCalculations';
import { Language, translations } from '../utils/translations';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  Filler
);

interface GradeChartProps {
  grades: StudentGrade[];
  kkm: number;
  config: ScalingConfig;
  isDark: boolean;
  language: Language;
}

const BINS = [
  { label: '< 50', min: 0, max: 49.99 },
  { label: '50 - 59', min: 50, max: 59.99 },
  { label: '60 - 69', min: 60, max: 69.99 },
  { label: '70 - 79', min: 70, max: 79.99 },
  { label: '80 - 89', min: 80, max: 89.99 },
  { label: '90 - 100', min: 90, max: 1000 },
];

export const GradeChart: React.FC<GradeChartProps> = ({
  grades,
  kkm,
  config,
  isDark,
  language,
}) => {
  const t = translations[language];
  const [chartView, setChartView] = useState<'histogram' | 'curve'>('histogram');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy prior chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.7)';

    if (chartView === 'histogram') {
      // Calculate bin counts
      const rawCounts = BINS.map((b) =>
        grades.filter((g) => g.rawScore >= b.min && g.rawScore <= b.max).length
      );
      const scaledCounts = BINS.map((b) =>
        grades.filter((g) => g.scaledScore >= b.min && g.scaledScore <= b.max).length
      );

      chartInstanceRef.current = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: BINS.map((b) => b.label),
          datasets: [
            {
              label: t.chartLegendRaw,
              data: rawCounts,
              backgroundColor: isDark ? 'rgba(148, 163, 184, 0.45)' : 'rgba(100, 116, 139, 0.55)',
              borderColor: isDark ? '#94a3b8' : '#64748b',
              borderWidth: 1.5,
              borderRadius: 6,
            },
            {
              label: t.chartLegendScaled,
              data: scaledCounts,
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.7)' : 'rgba(79, 70, 229, 0.75)',
              borderColor: isDark ? '#818cf8' : '#6366f1',
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 350,
          },
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: textColor,
                font: {
                  family: 'inherit',
                  size: 12,
                  weight: 600,
                },
                usePointStyle: true,
                boxWidth: 8,
              },
            },
            tooltip: {
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              titleColor: isDark ? '#f8fafc' : '#0f172a',
              bodyColor: isDark ? '#cbd5e1' : '#334155',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              borderWidth: 1,
              padding: 10,
              boxPadding: 4,
              callbacks: {
                label: (context) => {
                  const val = context.raw as number;
                  const total = grades.length || 1;
                  const pct = ((val / total) * 100).toFixed(1);
                  return ` ${context.dataset.label}: ${val} (${pct}%)`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
                font: {
                  size: 11,
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: gridColor,
              },
              ticks: {
                stepSize: 1,
                color: textColor,
                font: {
                  size: 11,
                },
              },
              title: {
                display: true,
                text: t.chartYAxis,
                color: textColor,
                font: {
                  size: 11,
                  weight: 500,
                },
              },
            },
          },
        },
      });
    } else {
      // CURVE VIEW: Transfer function curve (Raw score on x vs Scaled on y)
      const xRange: number[] = [];
      const yValues: number[] = [];
      const identityValues: number[] = [];

      const rawValues = grades.map((g) => g.rawScore);
      const datasetMin = rawValues.length > 0 ? Math.min(...rawValues) : 20;
      const datasetMax = rawValues.length > 0 ? Math.max(...rawValues) : 100;

      for (let x = 0; x <= 100; x += 2) {
        xRange.push(x);
        identityValues.push(x);
        yValues.push(computeScaledValue(x, config, datasetMin, datasetMax));
      }

      chartInstanceRef.current = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: xRange,
          datasets: [
            {
              label: `${t.chartTabCurve} (x → y)`,
              data: yValues,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderWidth: 3,
              tension: 0.2,
              pointRadius: 0,
              fill: false,
            },
            {
              label: t.chartLegendIdentity,
              data: identityValues,
              borderColor: isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(148, 163, 184, 0.5)',
              borderDash: [5, 5],
              borderWidth: 1.5,
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 350,
          },
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: textColor,
                font: {
                  family: 'inherit',
                  size: 12,
                  weight: 600,
                },
                usePointStyle: true,
                boxWidth: 8,
              },
            },
            tooltip: {
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              titleColor: isDark ? '#f8fafc' : '#0f172a',
              bodyColor: isDark ? '#cbd5e1' : '#334155',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              borderWidth: 1,
              callbacks: {
                label: (context) => {
                  return ` ${context.dataset.label}: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
                stepSize: 10,
              },
              title: {
                display: true,
                text: t.chartXAxisRaw,
                color: textColor,
              },
            },
            y: {
              min: 0,
              max: 100,
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
                stepSize: 10,
              },
              title: {
                display: true,
                text: t.chartYAxisScaled,
                color: textColor,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [grades, kkm, config, isDark, chartView, language, t]);

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t.chartTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.chartSubtitle}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            id="btn-chart-view-histogram"
            type="button"
            onClick={() => setChartView('histogram')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              chartView === 'histogram'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {t.chartTabHistogram}
          </button>
          <button
            id="btn-chart-view-curve"
            type="button"
            onClick={() => setChartView('curve')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              chartView === 'curve'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            {t.chartTabCurve}
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full h-72 sm:h-80">
        {grades.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            {language === 'id' ? 'Belum ada data nilai siswa untuk ditampilkan pada grafik.' : 'No student data available to display chart. Please input grades above.'}
          </div>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>
            {chartView === 'histogram'
              ? t.chartFooterHistogram.replace('{kkm}', String(kkm))
              : t.chartFooterCurve}
          </span>
        </div>
        <span className="font-mono text-[11px]">
          Total: {grades.length} {language === 'id' ? 'Siswa' : 'Students'}
        </span>
      </div>
    </section>
  );
};
