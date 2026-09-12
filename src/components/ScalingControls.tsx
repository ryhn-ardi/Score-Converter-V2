import React from 'react';
import {
  Sliders,
  TrendingUp,
  Compass,
  Zap,
  Hash,
  Calculator,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  Target,
  ShieldCheck,
  ArrowDownToLine,
  Lock,
  Info,
  GitMerge,
  Layers,
} from 'lucide-react';
import {
  RoundingMode,
  ScalingConfig,
  ScalingMethod,
  MaxSourceMode,
  MinSourceMode,
  TopScoreProtectionMode,
} from '../types';
import { computeScaledValue } from '../utils/gradeCalculations';
import { Language, translations } from '../utils/translations';

interface ScalingControlsProps {
  config: ScalingConfig;
  onChangeConfig: (newConfig: ScalingConfig) => void;
  datasetMin: number;
  datasetMax: number;
  language: Language;
}

export const ScalingControls: React.FC<ScalingControlsProps> = ({
  config,
  onChangeConfig,
  datasetMin,
  datasetMax,
  language,
}) => {
  const t = translations[language];
  const [testScore, setTestScore] = React.useState<number>(55);

  const updateConfig = (partial: Partial<ScalingConfig>) => {
    onChangeConfig({ ...config, ...partial });
  };

  // Preview test score conversion
  const testConverted = computeScaledValue(
    testScore,
    config,
    datasetMin || 30,
    datasetMax || 95
  );

  const activeMax = config.maxSourceMode === 'custom' ? config.customXMax : datasetMax;
  const activeMin = config.minSourceMode === 'custom' ? config.customXMin : datasetMin;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-colors space-y-6">
      {/* Title & KKM Quick Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t.controlsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.controlsSubtitle}
          </p>
        </div>

        {/* Global KKM Input */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 px-3.5 py-2 rounded-xl">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <span>{t.kkmLabel}</span>
              <span className="text-amber-600 dark:text-amber-400 font-normal">({t.kkmSubLabel})</span>
            </div>
            <div className="text-xs text-amber-700/80 dark:text-amber-400/80">
              Threshold benchmark
            </div>
          </div>
          <div className="flex items-center gap-1">
            <input
              id="input-kkm-threshold"
              type="number"
              min="0"
              max="100"
              value={config.kkm}
              onChange={(e) => updateConfig({ kkm: Number(e.target.value) || 75 })}
              className="w-16 text-center font-bold text-base sm:text-lg text-amber-900 dark:text-amber-100 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg py-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* METHOD SELECTOR TABS */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          {t.selectEngine}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Method A: Linear */}
          <button
            id="method-btn-linear"
            type="button"
            onClick={() => updateConfig({ method: 'linear' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              config.method === 'linear'
                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Method A
                </span>
                <TrendingUp className="w-4 h-4 text-indigo-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.methodA_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.methodA_desc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/50 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
              {t.methodA_formula}
            </div>
          </button>

          {/* Method B: Square Root Curve */}
          <button
            id="method-btn-sqrt"
            type="button"
            onClick={() => updateConfig({ method: 'sqrt' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              config.method === 'sqrt'
                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Method B
                </span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.methodB_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.methodB_desc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/50 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
              {t.methodB_formula}
            </div>
          </button>

          {/* Method C: KKM Threshold Only */}
          <button
            id="method-btn-kkm-threshold"
            type="button"
            onClick={() => updateConfig({ method: 'kkm-threshold' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              config.method === 'kkm-threshold'
                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Method C
                </span>
                <Compass className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.methodC_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.methodC_desc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/50 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
              {t.methodC_formula}
            </div>
          </button>

          {/* Method D: Cascading Chain Rules (x, b, y, c, z) */}
          <button
            id="method-btn-cascading-chain"
            type="button"
            onClick={() => updateConfig({ method: 'cascading-chain' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              config.method === 'cascading-chain'
                ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/50 ring-2 ring-blue-500/25'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Method D
                </span>
                <GitMerge className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.methodE_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.methodE_desc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-100 dark:border-blue-900/50 font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate">
              {t.methodE_formula}
            </div>
          </button>
        </div>
      </div>

      {/* FEATURE 2: AUTO-DETECTION & SELECTION OF MAXIMUM SCORE (x_max) */}
      <div className="bg-gradient-to-r from-indigo-50/90 to-blue-50/70 dark:from-slate-800/90 dark:to-indigo-950/40 p-4 sm:p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.maxSourceTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'id'
                  ? 'Tentukan batas atas acuan (x_max): diambil dari nilai tertinggi data siswa atau batas kustom guru.'
                  : 'Set reference upper bound (x_max): from highest student score or custom maximum standard.'}
              </p>
            </div>
          </div>

          {/* Badges showing BOTH detected dataset max AND the active x_max being used */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Auto-detected maximum badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t.detectedMaxBadge.replace('{val}', String(datasetMax))}
              </span>
            </div>

            {/* Active Maximum in use badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs ${
                config.maxSourceMode === 'custom'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-bold font-mono">
                {t.activeMaxBadge.replace('{val}', String(activeMax))}
              </span>
            </div>
          </div>
        </div>

        {/* Radio Selector: Auto Detected vs Custom Max */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Option 1: Auto-detected */}
          <label
            onClick={() => updateConfig({ maxSourceMode: 'auto' })}
            className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
              config.maxSourceMode === 'auto'
                ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <input
              type="radio"
              name="maxSourceMode"
              checked={config.maxSourceMode === 'auto'}
              onChange={() => updateConfig({ maxSourceMode: 'auto' })}
              className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.maxSourceAuto}
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  x_max = {datasetMax}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'id'
                  ? `Nilai tertinggi yang diperoleh siswa di kelas (${datasetMax}) otomatis menjadi patokan atas.`
                  : `Highest student score in dataset (${datasetMax}) automatically used as upper bound.`}
              </p>
            </div>
          </label>

          {/* Option 2: Custom Maximum */}
          <label
            onClick={() => updateConfig({ maxSourceMode: 'custom' })}
            className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
              config.maxSourceMode === 'custom'
                ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <input
              type="radio"
              name="maxSourceMode"
              checked={config.maxSourceMode === 'custom'}
              onChange={() => updateConfig({ maxSourceMode: 'custom' })}
              className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.maxSourceCustom}
                </span>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[11px] font-mono text-slate-500">x_max =</span>
                  <input
                    id="input-custom-xmax"
                    type="number"
                    min="1"
                    max="1000"
                    step="any"
                    value={config.customXMax ?? 100}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = parseFloat(val);
                      updateConfig({
                        maxSourceMode: 'custom',
                        customXMax: val === '' || isNaN(parsed) ? 0 : parsed,
                      });
                    }}
                    className="w-20 text-center text-xs font-bold py-1 px-2 rounded-md border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-xs"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.customMaxHint} {language === 'id' ? '(nilai penuh skala soal ujian).' : '(exam full mark scale).'}
              </p>
            </div>
          </label>
        </div>

        {/* Active source summary indicator */}
        <div className="text-[11px] text-indigo-900/80 dark:text-indigo-300/80 flex flex-wrap items-center justify-between gap-2 font-mono pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>
              {language === 'id' ? 'Batas atas aktif:' : 'Active upper bound:'}{' '}
              <strong>x_max = {activeMax}</strong>{' '}
              ({config.maxSourceMode === 'auto' ? (language === 'id' ? 'Otomatis dari Data' : 'Auto Data') : (language === 'id' ? 'Kustom Guru' : 'Custom Teacher')}).
            </span>
          </div>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            {language === 'id' ? `Nilai tertinggi di kelas: ${datasetMax}` : `Highest in class: ${datasetMax}`}
          </span>
        </div>
      </div>

      {/* METHOD-SPECIFIC PARAMETER CONTROLS */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        {config.method === 'linear' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.paramLinearTitle}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Range acuan: [{activeMin} → {activeMax}]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.targetMinLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="slider-target-min"
                    type="range"
                    min="50"
                    max="90"
                    value={config.targetMin}
                    onChange={(e) => updateConfig({ targetMin: Number(e.target.value) })}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <input
                    id="input-target-min"
                    type="number"
                    min="0"
                    max="100"
                    value={config.targetMin}
                    onChange={(e) => updateConfig({ targetMin: Number(e.target.value) })}
                    className="w-16 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[11px] text-slate-500">
                  {t.targetMinHint.replace('{kkm}', String(config.kkm))}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.targetMaxLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="slider-target-max"
                    type="range"
                    min="80"
                    max="100"
                    value={config.targetMax}
                    onChange={(e) => updateConfig({ targetMax: Number(e.target.value) })}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <input
                    id="input-target-max"
                    type="number"
                    min="0"
                    max="100"
                    value={config.targetMax}
                    onChange={(e) => updateConfig({ targetMax: Number(e.target.value) })}
                    className="w-16 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[11px] text-slate-500">
                  {t.targetMaxHint}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.minSourceTitle}
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={config.minSourceMode}
                    onChange={(e) => updateConfig({ minSourceMode: e.target.value as MinSourceMode })}
                    className="text-xs font-semibold py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex-1"
                  >
                    <option value="auto">Auto Data ({datasetMin})</option>
                    <option value="custom">Kustom</option>
                  </select>
                  {config.minSourceMode === 'custom' && (
                    <input
                      type="number"
                      value={config.customXMin}
                      onChange={(e) => updateConfig({ customXMin: Number(e.target.value) })}
                      className="w-16 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  )}
                </div>
                <span className="text-[11px] text-slate-500">
                  x_min aktif = {activeMin}
                </span>
              </div>
            </div>
          </div>
        )}

        {config.method === 'sqrt' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.sqrtMultiplierLabel}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="slider-sqrt-multiplier"
                    type="range"
                    min="8"
                    max="12"
                    step="0.1"
                    value={config.sqrtMultiplier}
                    onChange={(e) => updateConfig({ sqrtMultiplier: Number(e.target.value) })}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <input
                    id="input-sqrt-multiplier"
                    type="number"
                    min="1"
                    max="20"
                    step="0.1"
                    value={config.sqrtMultiplier}
                    onChange={(e) => updateConfig({ sqrtMultiplier: Number(e.target.value) })}
                    className="w-18 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[11px] text-slate-500">
                  {t.sqrtMultiplierHint
                    .replace('{val}', (Math.sqrt(49) * config.sqrtMultiplier).toFixed(1))
                    .replace('{val2}', (Math.sqrt(64) * config.sqrtMultiplier).toFixed(1))}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.maxCapLabel}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="slider-max-cap"
                    type="range"
                    min="90"
                    max="100"
                    value={config.maxCap}
                    onChange={(e) => updateConfig({ maxCap: Number(e.target.value) })}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <input
                    id="input-max-cap"
                    type="number"
                    min="50"
                    max="100"
                    value={config.maxCap}
                    onChange={(e) => updateConfig({ maxCap: Number(e.target.value) })}
                    className="w-18 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[11px] text-slate-500">
                  {t.maxCapHint}
                </span>
              </div>
            </div>
          </div>
        )}

        {config.method === 'kkm-threshold' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.kkmTargetMinLabel}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="slider-kkm-target-min"
                    type="range"
                    min="55"
                    max={config.kkm}
                    value={config.targetMin}
                    onChange={(e) => updateConfig({ targetMin: Number(e.target.value) })}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <input
                    id="input-kkm-target-min"
                    type="number"
                    min="0"
                    max={config.kkm}
                    value={config.targetMin}
                    onChange={(e) => updateConfig({ targetMin: Number(e.target.value) })}
                    className="w-18 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[11px] text-slate-500">
                  {t.kkmTargetMinHint.replace('{kkm}', String(config.kkm))}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.kkmAboveTitle}
                </label>
                <div className="space-y-2 mt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      id="radio-preserve-rank"
                      type="radio"
                      name="kkmAboveOption"
                      checked={config.kkmScaleAbove}
                      onChange={() => updateConfig({ kkmScaleAbove: true })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{t.kkmAboveSmooth.replace('{targetMax}', String(config.targetMax))}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      id="radio-keep-intact"
                      type="radio"
                      name="kkmAboveOption"
                      checked={!config.kkmScaleAbove}
                      onChange={() => updateConfig({ kkmScaleAbove: false })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{t.kkmAboveKeep}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* METHOD D: CASCADING CHAIN RULES (x, b, y, c, z) */}
        {config.method === 'cascading-chain' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <GitMerge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {t.paramCascadeTitle}
              </span>
              <span className="text-xs font-mono text-blue-700 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                Formula: a &lt; x → b | a = x → b + y | a = c → c + z
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.paramCascadeDesc}
            </p>

            {/* Visual Interactive Chain Diagram */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/80 space-y-2.5">
              <span className="text-[11px] font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 uppercase tracking-wide">
                <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {t.cascadeRuleSummary}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
                {/* Step 1 */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-semibold">
                    1. Siswa Remedial (a &lt; x)
                  </div>
                  <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                    Nilai Asli &lt; {config.cascadeX}
                  </div>
                  <div className="mt-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    → Menjadi {config.cascadeB}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 shadow-2xs ring-1 ring-blue-400/40">
                  <div className="text-[10px] text-blue-700 dark:text-blue-300 font-sans font-semibold">
                    2. Pas Ambang Batas (a = x)
                  </div>
                  <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                    Nilai Asli = {config.cascadeX}
                  </div>
                  <div className="mt-1 text-blue-700 dark:text-blue-300 font-bold">
                    → {config.cascadeB} + {config.cascadeY} = {config.cascadeB + config.cascadeY}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 shadow-2xs ring-1 ring-purple-400/40">
                  <div className="text-[10px] text-purple-700 dark:text-purple-300 font-sans font-semibold">
                    3. Ambang Lanjutan (a = c)
                  </div>
                  <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                    Nilai Asli = {config.cascadeCustomC ? config.cascadeC : (config.cascadeB + config.cascadeY)}
                  </div>
                  <div className="mt-1 text-purple-700 dark:text-purple-300 font-bold">
                    → {(config.cascadeCustomC ? config.cascadeC : (config.cascadeB + config.cascadeY))} + {config.cascadeZ} = {(config.cascadeCustomC ? config.cascadeC : (config.cascadeB + config.cascadeY)) + config.cascadeZ}
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-semibold">
                    4. Nilai Tinggi (a &gt; c)
                  </div>
                  <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                    Nilai &gt; {(config.cascadeCustomC ? config.cascadeC : (config.cascadeB + config.cascadeY))} s.d 100
                  </div>
                  <div className="mt-1 text-indigo-600 dark:text-indigo-400 font-bold">
                    → Melandai Aman (90+ = +0)
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Variable Controls: x, b, y, c, z */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {/* x: Ambang Batas 1 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.cascadeXLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="slider-cascade-x"
                    type="range"
                    min="50"
                    max="90"
                    value={config.cascadeX}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateConfig({ cascadeX: val, kkm: val });
                    }}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <input
                    id="input-cascade-x"
                    type="number"
                    min="0"
                    max="100"
                    value={config.cascadeX}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateConfig({ cascadeX: val, kkm: val });
                    }}
                    className="w-16 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.cascadeXHint}
                </p>
              </div>

              {/* b: Nilai Konversi untuk a < x */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.cascadeBLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="slider-cascade-b"
                    type="range"
                    min="50"
                    max="90"
                    value={config.cascadeB}
                    onChange={(e) => updateConfig({ cascadeB: Number(e.target.value) })}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <input
                    id="input-cascade-b"
                    type="number"
                    min="0"
                    max="100"
                    value={config.cascadeB}
                    onChange={(e) => updateConfig({ cascadeB: Number(e.target.value) })}
                    className="w-16 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.cascadeBHint}
                </p>
              </div>

              {/* y: Bonus Tambahan untuk a = x */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.cascadeYLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="slider-cascade-y"
                    type="range"
                    min="1"
                    max="10"
                    value={config.cascadeY}
                    onChange={(e) => updateConfig({ cascadeY: Number(e.target.value) })}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <input
                    id="input-cascade-y"
                    type="number"
                    min="1"
                    max="20"
                    value={config.cascadeY}
                    onChange={(e) => updateConfig({ cascadeY: Number(e.target.value) })}
                    className="w-16 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.cascadeYHint
                    .replace('{b}', String(config.cascadeB))
                    .replace('{y}', String(config.cascadeY))
                    .replace('{res}', String(config.cascadeB + config.cascadeY))}
                </p>
              </div>

              {/* c: Ambang Batas 2 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.cascadeCLabel}
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer select-none">
                    <input
                      id="checkbox-cascade-custom-c"
                      type="checkbox"
                      checked={config.cascadeCustomC}
                      onChange={(e) => updateConfig({ cascadeCustomC: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Custom</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="slider-cascade-c"
                    type="range"
                    min="60"
                    max="95"
                    disabled={!config.cascadeCustomC}
                    value={config.cascadeCustomC ? config.cascadeC : (config.cascadeB + config.cascadeY)}
                    onChange={(e) => updateConfig({ cascadeC: Number(e.target.value) })}
                    className="flex-1 accent-blue-600 cursor-pointer disabled:opacity-50"
                  />
                  <input
                    id="input-cascade-c"
                    type="number"
                    min="0"
                    max="100"
                    disabled={!config.cascadeCustomC}
                    value={config.cascadeCustomC ? config.cascadeC : (config.cascadeB + config.cascadeY)}
                    onChange={(e) => updateConfig({ cascadeC: Number(e.target.value) })}
                    className="w-16 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-50"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.cascadeCHint.replace('{val}', String(config.cascadeB + config.cascadeY))}
                </p>
              </div>

              {/* z: Bonus Tambahan untuk a = c */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.cascadeZLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="slider-cascade-z"
                    type="range"
                    min="1"
                    max="10"
                    value={config.cascadeZ}
                    onChange={(e) => updateConfig({ cascadeZ: Number(e.target.value) })}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <input
                    id="input-cascade-z"
                    type="number"
                    min="1"
                    max="20"
                    value={config.cascadeZ}
                    onChange={(e) => updateConfig({ cascadeZ: Number(e.target.value) })}
                    className="w-16 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.cascadeZHint
                    .replace('{c}', String(config.cascadeCustomC ? config.cascadeC : (config.cascadeB + config.cascadeY)))
                    .replace('{z}', String(config.cascadeZ))
                    .replace('{res}', String((config.cascadeCustomC ? config.cascadeC : (config.cascadeB + config.cascadeY)) + config.cascadeZ))}
                </p>
              </div>

              {/* Gaya Transisi Antara Jenjang */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.cascadeTransitionLabel}
                </label>
                <div className="space-y-1.5 pt-0.5">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="cascadeTransition"
                      checked={config.cascadeTransition === 'smooth'}
                      onChange={() => updateConfig({ cascadeTransition: 'smooth' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{t.cascadeTransitionSmooth}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="cascadeTransition"
                      checked={config.cascadeTransition === 'step'}
                      onChange={() => updateConfig({ cascadeTransition: 'step' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{t.cascadeTransitionStep}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SCHOOL POLICY & GRADE PROTECTION (Floor & Anti-Inflation) */}
      <div className="bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-slate-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-800/40 p-4 sm:p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {t.minScaledFloorTitle} & {t.topScoreProtectionTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {language === 'id'
                  ? 'Solusi kebijakan sekolah: tentukan nilai batas bawah rapor dan cegah nilai tinggi (90+) melonjak ke 97-100 saat mendongkrak nilai anjlok (30).'
                  : 'School policy solutions: set report card floor and protect top grades (90+) from runaway inflation when boosting failing grades (30).'}
              </p>
            </div>
          </div>

          {/* Active Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {config.minScaledFloorEnabled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                <ArrowDownToLine className="w-3 h-3" />
                Floor: {config.minScaledFloor}
              </span>
            )}
            {config.meritGapEnabled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                <CheckCircle2 className="w-3 h-3" />
                Merit Gap: +{config.meritGap} pt
              </span>
            )}
            {config.topScoreProtection !== 'none' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                <Lock className="w-3 h-3" />
                {config.topScoreProtection === 'lock-kkm' ? 'Lock ≥ KKM' : 'Damped Boost'}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* 1. BATAS BAWAH NILAI AKHIR (FLOOR NILAI RAPOR) */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="checkbox-enable-min-floor"
                  type="checkbox"
                  checked={config.minScaledFloorEnabled}
                  onChange={(e) => updateConfig({ minScaledFloorEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ArrowDownToLine className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {t.minScaledFloorToggle}
                </span>
              </label>

              {config.minScaledFloorEnabled && (
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Min: {config.minScaledFloor}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.minScaledFloorDesc}
            </p>

            {config.minScaledFloorEnabled ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-3">
                  <input
                    id="slider-min-scaled-floor"
                    type="range"
                    min="30"
                    max={config.kkm}
                    step="1"
                    value={config.minScaledFloor}
                    onChange={(e) => updateConfig({ minScaledFloor: Number(e.target.value) })}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <input
                    id="input-min-scaled-floor"
                    type="number"
                    min="0"
                    max={config.kkm}
                    value={config.minScaledFloor}
                    onChange={(e) => updateConfig({ minScaledFloor: Number(e.target.value) || 0 })}
                    className="w-18 text-center text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {language === 'id'
                      ? `Siswa dengan nilai serendah apapun (misal 30) tidak akan mendapat nilai di bawah ${config.minScaledFloor} di rapor.`
                      : `No student with low raw scores (e.g. 30) will receive below ${config.minScaledFloor} on report card.`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 italic">
                {language === 'id'
                  ? 'Batas bawah dimatikan (nilai akhir mengikuti kalkulasi matematis murni).'
                  : 'Floor clamp disabled (final scores follow raw calculation output).'}
              </div>
            )}
          </div>

          {/* 2. PERLINDUNGAN NILAI TINGGI (ANTI-INFLASI 90+) */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                {t.topScoreProtectionTitle}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                Anti-Inflasi
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.topScoreProtectionDesc}
            </p>

            <div className="space-y-2">
              {/* Option A: None (Standard) */}
              <label
                className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                  config.topScoreProtection === 'none'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 font-medium'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <input
                  type="radio"
                  name="topScoreProtection"
                  checked={config.topScoreProtection === 'none'}
                  onChange={() => updateConfig({ topScoreProtection: 'none' })}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {t.topScoreModeNone}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.topScoreModeNoneDesc}
                  </div>
                </div>
              </label>

              {/* Option B: Lock Passing (Recommended) */}
              <label
                className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                  config.topScoreProtection === 'lock-kkm'
                    ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/50 font-medium ring-1 ring-purple-400/40'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <input
                  type="radio"
                  name="topScoreProtection"
                  checked={config.topScoreProtection === 'lock-kkm'}
                  onChange={() => updateConfig({ topScoreProtection: 'lock-kkm' })}
                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="font-semibold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                    {t.topScoreModeLock}
                    <span className="text-[10px] font-bold bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded">
                      Rekomendasi
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-800/80 dark:text-purple-300/80">
                    {t.topScoreModeLockDesc}
                  </div>
                </div>
              </label>

              {/* Option C: Damped Boost */}
              <label
                className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                  config.topScoreProtection === 'damped'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 font-medium'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <input
                  type="radio"
                  name="topScoreProtection"
                  checked={config.topScoreProtection === 'damped'}
                  onChange={() => updateConfig({ topScoreProtection: 'damped' })}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {t.topScoreModeDamped}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.topScoreModeDampedDesc}
                  </div>
                </div>
              </label>

              {/* DAMPED BOOST CUSTOM THRESHOLDS (Jika mode Teredam aktif) */}
              {config.topScoreProtection === 'damped' && (
                <div className="mt-2 p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      {t.dampedSettingsTitle}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-indigo-200/80 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-200 px-1.5 py-0.5 rounded">
                      ≥ {config.dampedFreezeThreshold} = +0 Poin
                    </span>
                  </div>

                  {/* 1. Freeze Threshold (Kunci Nol Kenaikan) */}
                  <div className="space-y-1 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-slate-800 dark:text-slate-200">
                        {t.dampedFreezeLabel}
                      </label>
                      <input
                        type="number"
                        min="80"
                        max="100"
                        value={config.dampedFreezeThreshold ?? 90}
                        onChange={(e) =>
                          updateConfig({
                            dampedFreezeThreshold: Math.min(100, Math.max(70, Number(e.target.value) || 90)),
                          })
                        }
                        className="w-16 text-center font-mono font-bold text-xs py-0.5 px-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="98"
                      value={config.dampedFreezeThreshold ?? 90}
                      onChange={(e) => updateConfig({ dampedFreezeThreshold: Number(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5"
                    />
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                      ✓ {t.dampedFreezeHint}
                    </p>
                  </div>

                  {/* 2. Titik Mulai Redaman (dampedStart) & Max Boost */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-white/70 dark:bg-slate-900/70 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {t.dampedStartLabel}
                        </span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {config.dampedStart ?? 75}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max={(config.dampedFreezeThreshold ?? 90) - 2}
                        value={config.dampedStart ?? 75}
                        onChange={(e) => updateConfig({ dampedStart: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5"
                      />
                      <p className="text-[9px] text-slate-500 dark:text-slate-400">
                        {t.dampedStartHint}
                      </p>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-900/70 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {t.dampedMaxBoostLabel}
                        </span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          +{config.dampedMaxBoost ?? 2} pt
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={config.dampedMaxBoost ?? 2}
                        onChange={(e) => updateConfig({ dampedMaxBoost: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5"
                      />
                      <p className="text-[9px] text-slate-500 dark:text-slate-400">
                        {t.dampedMaxBoostHint}
                      </p>
                    </div>
                  </div>

                  {/* MINI TEST MATRIX: Menampilkan langsung kenaikan untuk 30, 75, 85, 90, 91, 95 */}
                  <div className="pt-1">
                    <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>{t.dampedPreviewTitle}:</span>
                      <span className="text-[9px] font-normal text-indigo-600 dark:text-indigo-400">
                        (Nilai Asli → Hasil)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center font-mono text-[11px]">
                      {[30, 60, config.dampedStart ?? 75, 85, config.dampedFreezeThreshold ?? 90, 95].map(
                        (val) => {
                          const res = computeScaledValue(val, config, datasetMin, datasetMax);
                          const delta = res - val;
                          const isZero = delta <= 0.05;
                          return (
                            <div
                              key={val}
                              className={`p-1 rounded-md border text-[10px] ${
                                isZero
                                  ? 'bg-purple-100/80 dark:bg-purple-950/80 border-purple-300 dark:border-purple-700 font-bold'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <div className="text-slate-500 dark:text-slate-400 text-[9px]">
                                Asli: {val}
                              </div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {res.toFixed(config.decimals)}
                              </div>
                              <div
                                className={`text-[9px] font-bold ${
                                  isZero
                                    ? 'text-purple-700 dark:text-purple-300'
                                    : 'text-emerald-600 dark:text-emerald-400'
                                }`}
                              >
                                {isZero ? 'Terkunci (+0)' : `+${delta.toFixed(1)}`}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. PEMBEDA SISWA TUNTAS (MERIT GAP) - Solusi Kasus Nilai Khusus */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-3 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="checkbox-merit-gap"
                type="checkbox"
                checked={config.meritGapEnabled}
                onChange={(e) => updateConfig({ meritGapEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {t.meritGapToggle}
              </span>
            </label>

            {config.meritGapEnabled && (
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                Pembeda: +{config.meritGap} Poin
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.meritGapHint
              .replace('{kkm}', String(config.kkm))
              .replace('{val}', String(config.kkm + config.meritGap))}
          </p>

          {config.meritGapEnabled && (
            <div className="space-y-2 pt-1 border-t border-blue-200/60 dark:border-blue-800/60">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {t.meritGapLabel}:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={config.meritGap}
                    onChange={(e) => updateConfig({ meritGap: Number(e.target.value) || 1 })}
                    className="w-28 sm:w-40 accent-blue-600 cursor-pointer h-1.5"
                  />
                  <span className="font-mono font-bold text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                    +{config.meritGap} pt
                  </span>
                </div>
              </div>

              {/* Visual Comparison Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[11px] font-mono pt-1">
                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-900">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Siswa Anjlok (Asli 30)</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Hasil: {computeScaledValue(30, config, datasetMin, datasetMax).toFixed(config.decimals)}
                  </div>
                  <div className="text-[9px] text-amber-600 dark:text-amber-400 font-bold">Terangkat ke Batas Minimum</div>
                </div>

                <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700 ring-1 ring-blue-400/50">
                  <div className="text-[10px] text-blue-700 dark:text-blue-300 font-bold">Siswa Tuntas (Asli {config.kkm})</div>
                  <div className="text-sm font-extrabold text-blue-900 dark:text-blue-200">
                    Hasil: {computeScaledValue(config.kkm, config, datasetMin, datasetMax).toFixed(config.decimals)}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Lebih Tinggi (+{config.meritGap} pt)
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-900">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Siswa Tinggi (Asli 90)</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Hasil: {computeScaledValue(90, config, datasetMin, datasetMax).toFixed(config.decimals)}
                  </div>
                  <div className="text-[9px] text-purple-600 dark:text-purple-400 font-bold">Terkendali / Realistis</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. OPTIONAL MAX DELTA (POINT BOOST) CAP */}
        <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="checkbox-max-delta-cap"
              type="checkbox"
              checked={config.maxDeltaCapEnabled}
              onChange={(e) => updateConfig({ maxDeltaCapEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600"
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {t.maxDeltaCapToggle}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">
              ({t.maxDeltaCapHint})
            </span>
          </label>

          {config.maxDeltaCapEnabled && (
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-400 text-xs">Maksimal +Poin:</span>
              <input
                id="input-max-delta-cap"
                type="number"
                min="1"
                max="50"
                value={config.maxDeltaCap}
                onChange={(e) => updateConfig({ maxDeltaCap: Number(e.target.value) || 1 })}
                className="w-16 text-center font-mono font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* ROUNDING & LIVE SIMULATOR BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Rounding Options */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-indigo-500" />
            {t.roundingTitle}
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
                {t.decimalsLabel}
              </label>
              <div className="flex rounded-lg bg-slate-200 dark:bg-slate-700 p-0.5">
                {[0, 1, 2].map((dec) => (
                  <button
                    key={dec}
                    id={`btn-decimals-${dec}`}
                    type="button"
                    onClick={() => updateConfig({ decimals: dec as 0 | 1 | 2 })}
                    className={`flex-1 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      config.decimals === dec
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {dec === 0 ? t.integerOption : `${dec} dec`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
                {t.roundingModeLabel}
              </label>
              <div className="flex rounded-lg bg-slate-200 dark:bg-slate-700 p-0.5">
                {(['round', 'floor', 'ceil'] as RoundingMode[]).map((mode) => (
                  <button
                    key={mode}
                    id={`btn-rounding-${mode}`}
                    type="button"
                    onClick={() => updateConfig({ roundingMode: mode })}
                    className={`flex-1 py-1 text-xs font-semibold capitalize rounded-md transition cursor-pointer ${
                      config.roundingMode === mode
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {mode === 'round' ? t.roundModeStandard : mode === 'floor' ? t.roundModeFloor : t.roundModeCeil}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator Preview */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              {t.simulatorTitle}
            </span>
            <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-mono">
              {t.simulatorDragHint}
            </span>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>{t.rawTestLabel} <strong>{testScore}</strong></span>
                <span>KKM: {config.kkm}</span>
              </div>
              <input
                id="slider-live-test-score"
                type="range"
                min="0"
                max="100"
                value={testScore}
                onChange={(e) => setTestScore(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              {/* Quick Preset Buttons for Common Cases (e.g. 30, 90) */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 font-medium">Uji Cepat:</span>
                {[
                  { label: '30 (Anjlok)', val: 30 },
                  { label: '55', val: 55 },
                  { label: `${config.kkm} (KKM)`, val: config.kkm },
                  { label: '85', val: 85 },
                  { label: '90 (Tinggi)', val: 90 },
                  { label: '91 (Kunci)', val: 91 },
                  { label: '95', val: 95 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setTestScore(preset.val)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition cursor-pointer ${
                      testScore === preset.val
                        ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 shadow-xs min-w-24 shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                {t.convertedResultLabel}
              </div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-300 font-mono">
                {testConverted}
              </div>
              <div className={`text-[10px] font-semibold ${testConverted >= config.kkm ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {testConverted >= config.kkm ? t.statusPassed : t.statusFailed}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {testConverted - testScore >= 0 ? `+${(testConverted - testScore).toFixed(config.decimals)}` : `${(testConverted - testScore).toFixed(config.decimals)}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
