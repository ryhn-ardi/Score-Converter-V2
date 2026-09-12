import React from 'react';
import {
  GraduationCap,
  Sun,
  Moon,
  RotateCcw,
  BookOpen,
  Printer,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onResetSample: () => void;
  onClearData: () => void;
  onOpenGuide: () => void;
  onPrint: () => void;
  totalStudents: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onResetSample,
  onClearData,
  onOpenGuide,
  onPrint,
  totalStudents,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Grade Converter &amp; Scaler
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Teacher Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Dongkrak &amp; Konversi Nilai Siswa Sesuai KKM (Passing Grade)
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Guide Button */}
            <button
              id="btn-open-formula-guide"
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="View Scaling Formulas & Mathematical Guide"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span className="hidden md:inline">Formula Guide</span>
            </button>

            {/* Print Button */}
            <button
              id="btn-print-report"
              type="button"
              onClick={onPrint}
              disabled={totalStudents === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Print Clean Grade Report"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Reset Sample Data */}
            <button
              id="btn-load-sample-data"
              type="button"
              onClick={onResetSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
              title="Load Sample 26-Student Classroom"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden lg:inline">Sample Class</span>
            </button>

            {/* Clear Data */}
            {totalStudents > 0 && (
              <button
                id="btn-clear-all-data"
                type="button"
                onClick={onClearData}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Clear all student data"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden xl:inline">Clear</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              id="btn-theme-toggle"
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
