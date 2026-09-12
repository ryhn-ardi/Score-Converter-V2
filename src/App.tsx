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
import { Language, translations } from './utils/translations';
import { FileText } from 'lucide-react';

const DEFAULT_CONFIG: ScalingConfig = {
  method: 'linear',
  kkm: 75,
  targetMin: 75,
  targetMax: 95,
  maxSourceMode: 'auto',
  minSourceMode: 'auto',
  customXMin: 0,
  customXMax: 100,
  sqrtMultiplier: 10,
  maxCap: 100,
  minScaledFloorEnabled: false,
  minScaledFloor: 65,
  topScoreProtection: 'none',
  dampedStart: 75,
  dampedFreezeThreshold: 90,
  dampedMaxBoost: 2,
  meritGapEnabled: true,
  meritGap: 3,
  cascadeX: 75,
  cascadeB: 75,
  cascadeY: 3,
  cascadeC: 78,
  cascadeCustomC: false,
  cascadeZ: 2,
  cascadeTransition: 'smooth',
  maxDeltaCapEnabled: false,
  maxDeltaCap: 20,
  kkmScaleAbove: true,
  constantAdd: 10,
  decimals: 1,
  roundingMode: 'round',
};

export default function App() {
  // Language state (default Indonesian 'id', can toggle to 'en')
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grade_scaler_lang');
      if (saved === 'id' || saved === 'en') return saved;
    }
    return 'id'; // Default to Indonesian
  });

  const t = translations[language];

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
  const [examTitle, setExamTitle] = useState(() =>
    language === 'id' ? 'Penilaian Akhir Semester - Matematika' : 'Final Semester Exam - Mathematics'
  );

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

  // Persist language
  useEffect(() => {
    localStorage.setItem('grade_scaler_lang', language);
  }, [language]);

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
    if (students.length === 0) return { datasetMin: 0, datasetMax: 0 };
    const rawScores = students.map((s) => Number(s.rawScore) || 0);
    return {
      datasetMin: Math.min(...rawScores),
      datasetMax: Math.max(...rawScores),
    };
  }, [students]);

  // Method display name
  const methodName = useMemo(() => {
    switch (config.method) {
      case 'linear':
        return language === 'id'
          ? `Linier Min-Max (Min: ${config.targetMin}, Max: ${config.targetMax})`
          : `Linear Min-Max (Min: ${config.targetMin}, Max: ${config.targetMax})`;
      case 'sqrt':
        return language === 'id'
          ? `Kurva Akar Kuadrat (Pengali: ${config.sqrtMultiplier})`
          : `Square Root Curve (Multiplier: ${config.sqrtMultiplier})`;
      case 'kkm-threshold':
        return language === 'id'
          ? `Ambang Batas KKM (Target Min: ${config.targetMin})`
          : `KKM Threshold Piecewise (Target Min: ${config.targetMin})`;
      case 'constant-add':
        return language === 'id'
          ? `Tambah Nilai Tetap (+${config.constantAdd} poin)`
          : `Constant Boost (+${config.constantAdd} pts)`;
      default:
        return 'Standard Scaling';
    }
  }, [config, language]);

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
    const confirmMsg = language === 'id'
      ? 'Apakah Anda yakin ingin menghapus semua data nilai siswa?'
      : 'Are you sure you want to clear all student records?';
    if (window.confirm(confirmMsg)) {
      setStudents([]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors font-sans pb-16">
      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
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
                {language === 'id' ? 'Laporan Hasil Konversi & Rekapitulasi Nilai Siswa' : 'Official Student Grade Scaling & Recapitulation Report'}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {language === 'id' ? 'Mata Pelajaran / Ujian:' : 'Subject / Assessment:'} {examTitle}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>{language === 'id' ? 'Metode:' : 'Method:'} {methodName}</p>
              <p>{language === 'id' ? 'Standar KKM:' : 'KKM Standard:'} {config.kkm}</p>
              <p>{language === 'id' ? 'Tanggal Cetak:' : 'Printed Date:'} {new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')}</p>
            </div>
          </div>
        </div>

        {/* Exam Title & Subject Customizer (Screen view) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:px-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs no-print">
          <div className="flex items-center gap-2.5 flex-1">
            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {language === 'id' ? 'Mata Pelajaran / Kelas:' : 'Assessment / Class:'}
            </span>
            <input
              id="input-exam-title"
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder={language === 'id' ? 'Contoh: Penilaian Harian Fisika - Kelas X IPA 1' : 'e.g. Midterm Physics Grade - Class 10 IPA'}
              className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 focus:border-indigo-500 focus:outline-none w-full max-w-md py-0.5"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
              {language === 'id' ? 'Metode Aktif:' : 'Active Engine:'}{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">{config.method.toUpperCase()}</strong>
            </span>
          </div>
        </div>

        {/* Section 1: Data Input & File Upload */}
        <div className="no-print">
          <DataInputSection
            onLoadStudents={handleLoadStudents}
            currentCount={students.length}
            currentMax={datasetMax}
            currentMin={datasetMin}
            language={language}
          />
        </div>

        {/* Section 2: Conversion & Scaling Controls */}
        <div className="no-print">
          <ScalingControls
            config={config}
            onChangeConfig={setConfig}
            datasetMin={datasetMin}
            datasetMax={datasetMax}
            language={language}
          />
        </div>

        {/* Section 3: Comparative Statistics Summary */}
        <StatsOverview
          stats={stats}
          kkm={config.kkm}
          language={language}
        />

        {/* Section 4: Visual Chart (Side-by-side distribution) */}
        <div className="no-print">
          <GradeChart
            grades={processedGrades}
            kkm={config.kkm}
            config={config}
            isDark={isDark}
            language={language}
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
          language={language}
        />
      </main>

      {/* Formula & Educational Guide Modal */}
      <FormulaModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        language={language}
      />
    </div>
  );
}
