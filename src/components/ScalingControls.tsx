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
} from 'lucide-react';
import { RoundingMode, ScalingConfig, ScalingMethod, MaxSourceMode, MinSourceMode } from '../types';
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            </div>

            <div className="text-center px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 shadow-xs min-w-24">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                {t.convertedResultLabel}
              </div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-300 font-mono">
                {testConverted}
              </div>
              <div className={`text-[10px] font-semibold ${testConverted >= config.kkm ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {testConverted >= config.kkm ? t.statusPassed : t.statusFailed}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
