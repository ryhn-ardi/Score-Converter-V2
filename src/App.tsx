import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DataInputSection } from './components/DataInputSection';
import { ScalingControls } from './components/ScalingControls';
import { StatsOverview } from './components/StatsOverview';
import { GradeChart } from './components/GradeChart';
import { GradeTable } from './components/GradeTable';
import { FormulaModal } from './components/FormulaModal';
import { SAMPLE_STUDENT_DATA } from './data/sampleData';
import { ScalingConfig, StudentRawInput } from './types';
import { computeStatistics, processStudentGrades } from './utils/gradeCalculations';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';

const DEFAULT_CONFIG: ScalingConfig = {
  method: 'linear',
  kkm: 75,
  targetMin: 75,
  targetMax: 95,
  useActualMinMax: true,
  customXMin: 0,
  customXMax: 100,
  sqrtMultiplier: 10,
  maxCap: 100,
  kkmScaleAbove: true,
  constantAdd: 10,
  decimals: 1,
  roundingMode: 'round',
};

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grade_scaler_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Students raw inputs
  const [students, setStudents] = useState<StudentRawInput[]>(() => {
    const saved = localStorage.getItem('grade_scaler_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse cached students', e);
      }
    }
    return SAMPLE_STUDENT_DATA;
  });

  // Scaling configuration
  const [config, setConfig] = useState<ScalingConfig>(() => {
    const saved = localStorage.getItem('grade_scaler_config');
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse cached config', e);
      }
    }
    return DEFAULT_CONFIG;
  });

  // Guide modal state
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Subject title for print & export header
  const [examTitle, setExamTitle] = useState('Final Semester Exam - Mathematics');

  // Sync theme to document class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('grade_scaler_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('grade_scaler_theme', 'light');
    }
  }, [isDark]);

  // Persist students
  useEffect(() => {
    localStorage.setItem('grade_scaler_students', JSON.stringify(students));
  }, [students]);

  // Persist config
  useEffect(() => {
    localStorage.setItem('grade_scaler_config', JSON.stringify(config));
  }, [config]);

  // Process grades in real time
  const processedGrades = useMemo(() => {
    return processStudentGrades(students, config);
  }, [students, config]);

  // Real-time comparative statistics
  const stats = useMemo(() => {
    return computeStatistics(processedGrades, config.kkm);
  }, [processedGrades, config.kkm]);

  // Dataset min and max
  const { datasetMin, datasetMax } = useMemo(() => {
    if (students.length === 0) return { datasetMin: 0, datasetMax: 100 };
    const rawScores = students.map((s) => s.rawScore);
    return {
      datasetMin: Math.min(...rawScores),
      datasetMax: Math.max(...rawScores),
    };
  }, [students]);

  // Method display name
  const methodName = useMemo(() => {
    switch (config.method) {
      case 'linear':
        return `Linear Min-Max (Min: ${config.targetMin}, Max: ${config.targetMax})`;
      case 'sqrt':
        return `Square Root Curve (Multiplier: ${config.sqrtMultiplier})`;
      case 'kkm-threshold':
        return `KKM Threshold Piecewise (Target Min: ${config.targetMin})`;
      case 'constant-add':
        return `Constant Boost (+${config.constantAdd} pts)`;
      default:
        return 'Standard Scaling';
    }
  }, [config]);

  // Handlers
  const handleLoadStudents = (newStudents: StudentRawInput[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      setStudents(newStudents);
    } else {
      setStudents((prev) => [...prev, ...newStudents]);
    }
  };

  const handleUpdateRawScore = (id: string, newScore: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rawScore: newScore } : s))
    );
  };

  const handleUpdateName = (id: string, newName: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetSample = () => {
    setStudents(SAMPLE_STUDENT_DATA);
    setConfig(DEFAULT_CONFIG);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all student records?')) {
      setStudents([]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors font-sans pb-16">
      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onResetSample={handleResetSample}
        onClearData={handleClearData}
        onOpenGuide={() => setIsGuideOpen(true)}
        onPrint={handlePrint}
        totalStudents={students.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Printable Official Report Header (visible only when printing) */}
        <div className="hidden print:block mb-6 pb-4 border-b-2 border-slate-900">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide">
                Laporan Hasil Konversi &amp; Rekapitulasi Nilai Siswa
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Mata Pelajaran / Ujian: {examTitle}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Metode: {methodName}</p>
              <p>Standar KKM: {config.kkm}</p>
              <p>Tanggal Cetak: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Exam Title & Subject Customizer (Screen view) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:px-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs no-print">
          <div className="flex items-center gap-2.5 flex-1">
            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Assessment / Class:
            </span>
            <input
              id="input-exam-title"
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="e.g. Midterm Physics Grade - Class 10 IPA"
              className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 focus:border-indigo-500 focus:outline-none w-full max-w-md py-0.5"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
              Active Engine: <strong className="text-indigo-600 dark:text-indigo-400">{config.method.toUpperCase()}</strong>
            </span>
          </div>
        </div>

        {/* Section 1: Data Input & File Upload */}
        <div className="no-print">
          <DataInputSection
            onLoadStudents={handleLoadStudents}
            currentCount={students.length}
          />
        </div>

        {/* Section 2: Conversion & Scaling Controls */}
        <div className="no-print">
          <ScalingControls
            config={config}
            onChangeConfig={setConfig}
            datasetMin={datasetMin}
            datasetMax={datasetMax}
          />
        </div>

        {/* Section 3: Comparative Statistics Summary */}
        <StatsOverview stats={stats} kkm={config.kkm} />

        {/* Section 4: Visual Chart (Side-by-side distribution) */}
        <div className="no-print">
          <GradeChart
            grades={processedGrades}
            kkm={config.kkm}
            config={config}
            isDark={isDark}
          />
        </div>

        {/* Section 5: Data Table & Results */}
        <GradeTable
          grades={processedGrades}
          kkm={config.kkm}
          methodName={methodName}
          onUpdateRawScore={handleUpdateRawScore}
          onUpdateName={handleUpdateName}
          onDeleteStudent={handleDeleteStudent}
        />
      </main>

      {/* Formula & Educational Guide Modal */}
      <FormulaModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
