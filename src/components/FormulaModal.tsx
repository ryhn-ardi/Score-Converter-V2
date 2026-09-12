import React from 'react';
import { X, BookOpen, Calculator, CheckCircle2, TrendingUp, Zap, Compass } from 'lucide-react';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 text-slate-800 dark:text-slate-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Grade Scaling &amp; Conversion Guide for Teachers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Panduan Matematis &amp; Pedagogis Konversi Nilai Siswa
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          {/* Method A */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Method A: Linear Scaling (Min-Max Interpolation)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs my-2 text-slate-800 dark:text-slate-200">
              y = y_min + ((x - x_min) * (y_max - y_min)) / (x_max - x_min)
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                <strong>How it works:</strong> Stretches and maps your class's lowest raw score to your target minimum (e.g. KKM = 70) and highest raw score to your target maximum (e.g. 95 or 100).
              </li>
              <li>
                <strong>Mathematical Property:</strong> Perfectly linear. Proportional differences and class rank rankings are 100% preserved.
              </li>
              <li>
                <strong>When to use:</strong> Excellent for standardized tests where the exam was excessively difficult overall and all scores need a uniform proportional lift.
              </li>
            </ul>
          </div>

          {/* Method B */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 mb-2">
              <Zap className="w-4 h-4" />
              <span>Method B: Square Root Curve (Dongkrak Nilai Bawah)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs my-2 text-slate-800 dark:text-slate-200">
              y = √(x) × 10 (capped at 100)
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                <strong>How it works:</strong> The square root function is concave downward. It gives a major boost to low scores while tapering off as scores approach 100.
              </li>
              <li>
                <strong>Example values:</strong>
                <span className="block pl-4 font-mono text-[11px] mt-1 text-slate-700 dark:text-slate-300">
                  Raw 36 → 60 (+24) | Raw 49 → 70 (+21) | Raw 64 → 80 (+16) | Raw 81 → 90 (+9) | Raw 100 → 100 (+0)
                </span>
              </li>
              <li>
                <strong>When to use:</strong> The classic Indonesian and international curve to rescue failing scores without inflating top achievers who already excelled.
              </li>
            </ul>
          </div>

          {/* Method C */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              <Compass className="w-4 h-4" />
              <span>Method C: KKM Threshold Only (Piecewise Scaling)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs my-2 text-slate-800 dark:text-slate-200">
              If x &lt; KKM: y = y_min + ((x - x_min)·(KKM - y_min)) / (KKM - x_min)<br />
              If x ≥ KKM: y = x (or smoothly scaled to Target Max)
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                <strong>How it works:</strong> Focuses specifically on remedial recovery for students who fell short of KKM, bringing the lowest student up to y_min and scaling up to KKM.
              </li>
              <li>
                <strong>Smooth transition option:</strong> Allows preserving rank order above KKM so that students who earned high scores naturally maintain a fair advantage over boosted students.
              </li>
            </ul>
          </div>

          {/* Practical Tips */}
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200">
            <h4 className="font-bold flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Pedagogical Best Practices
            </h4>
            <p className="text-xs leading-relaxed text-indigo-900/90 dark:text-indigo-300">
              Always archive the raw scores alongside the scaled scores (the exported Excel file includes both columns automatically). Document which scaling method was selected in your semester lesson logbook or remedial assessment report.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
