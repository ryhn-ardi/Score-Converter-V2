import React from 'react';
import {
  Sliders,
  TrendingUp,
  Percent,
  Compass,
  Zap,
  HelpCircle,
  Hash,
  Calculator,
} from 'lucide-react';
import { RoundingMode, ScalingConfig, ScalingMethod } from '../types';
import { computeScaledValue } from '../utils/gradeCalculations';

interface ScalingControlsProps {
  config: ScalingConfig;
  onChangeConfig: (newConfig: ScalingConfig) => void;
  datasetMin: number;
  datasetMax: number;
}

export const ScalingControls: React.FC<ScalingControlsProps> = ({
  config,
  onChangeConfig,
  datasetMin,
  datasetMax,
}) => {
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

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-colors space-y-6">
      {/* Title & KKM Quick Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Conversion &amp; Scaling Parameters
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Choose a mathematical scaling method and calibrate thresholds in real-time.
          </p>
        </div>

        {/* Global KKM Input */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 px-3.5 py-2 rounded-xl">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <span>KKM Passing Grade</span>
              <span className="text-amber-600 dark:text-amber-400 font-normal">(Nilai Tuntas)</span>
            </div>
            <div className="text-xs text-amber-700/80 dark:text-amber-400/80">
              Threshold for passing
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
          Select Scaling Engine
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
                Linear Scaling (Min-Max)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Interpolates grades into a Target Min (e.g. 70) and Target Max (e.g. 95) while preserving proportional distances.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/50 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
              y = y_min + ((x-x_min)·Δy) / Δx
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
                Square Root Curve
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Classic "Dongkrak Nilai Bawah". Gives a larger boost to lower scores while tapering off as scores approach 100.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/50 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
              y = √(x) × multiplier (cap: 100)
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
                KKM Threshold Only
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Focuses specifically on students below KKM to bring them to passing, keeping already passing grades intact or smoothly adjusted.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/50 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
              Piecewise boost for x &lt; KKM
            </div>
          </button>
        </div>
      </div>

      {/* METHOD-SPECIFIC PARAMETER CONTROLS */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        {config.method === 'linear' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Linear Min-Max Parameters
              </span>
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  id="checkbox-use-actual-minmax"
                  type="checkbox"
                  checked={config.useActualMinMax}
                  onChange={(e) => updateConfig({ useActualMinMax: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Auto-use dataset min ({datasetMin || 0}) &amp; max ({datasetMax || 100})</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Target Min (y_min)
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
                <span className="text-[11px] text-slate-500">Lowest student gets this score (e.g. KKM {config.kkm})</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Target Max (y_max)
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
                <span className="text-[11px] text-slate-500">Highest student gets this score (e.g. 95 or 100)</span>
              </div>

              {!config.useActualMinMax && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Source Min (x_min)
                    </label>
                    <input
                      id="input-source-min"
                      type="number"
                      min="0"
                      max="100"
                      value={config.customXMin}
                      onChange={(e) => updateConfig({ customXMin: Number(e.target.value) })}
                      className="w-full text-xs font-bold py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <span className="text-[11px] text-slate-500">Custom lower bound</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Source Max (x_max)
                    </label>
                    <input
                      id="input-source-max"
                      type="number"
                      min="0"
                      max="100"
                      value={config.customXMax}
                      onChange={(e) => updateConfig({ customXMax: Number(e.target.value) })}
                      className="w-full text-xs font-bold py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <span className="text-[11px] text-slate-500">Custom upper bound</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {config.method === 'sqrt' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Multiplier (Default = 10)
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
                  Formula: y = √(x) × {config.sqrtMultiplier}. (Example: raw 49 becomes {(Math.sqrt(49) * config.sqrtMultiplier).toFixed(1)})
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Maximum Score Cap
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
                  Prevents any boosted score from exceeding this ceiling
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
                  Target Min for Failing Scores (y_min)
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
                  The lowest score in class will scale up to this value, and scale smoothly up to KKM ({config.kkm}).
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Scores Above KKM Handling
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
                    <span>Scale smoothly from KKM to {config.targetMax} (Preserves rank order)</span>
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
                    <span>Keep passing scores intact (Original score untouched)</span>
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
            Rounding &amp; Precision Options
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
                Decimal Places
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
                    {dec === 0 ? 'Integer' : `${dec} dec`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
                Rounding Mode
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
                    {mode}
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
              Live Score Simulator
            </span>
            <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-mono">
              Drag to test any score
            </span>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Raw Test: <strong>{testScore}</strong></span>
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
                Converted
              </div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-300 font-mono">
                {testConverted}
              </div>
              <div className={`text-[10px] font-semibold ${testConverted >= config.kkm ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {testConverted >= config.kkm ? '✓ Tuntas' : '✗ Belum Tuntas'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
