import { RoundingMode, ScalingConfig, StudentGrade, StudentRawInput, SummaryStats } from '../types';

export function roundScore(value: number, decimals: number, mode: RoundingMode = 'round'): number {
  const factor = Math.pow(10, decimals);
  let res: number;
  if (mode === 'floor') {
    res = Math.floor(value * factor) / factor;
  } else if (mode === 'ceil') {
    res = Math.ceil(value * factor) / factor;
  } else {
    res = Math.round(value * factor) / factor;
  }
  return Number(res.toFixed(decimals));
}

export function computeScaledValue(
  raw: number,
  config: ScalingConfig,
  datasetMin: number,
  datasetMax: number
): number {
  let computed = raw;

  if (config.method === 'linear') {
    const xMin = config.useActualMinMax ? datasetMin : config.customXMin;
    const xMax = config.useActualMinMax ? datasetMax : config.customXMax;
    const yMin = config.targetMin;
    const yMax = config.targetMax;

    if (xMax === xMin) {
      computed = yMin;
    } else {
      computed = yMin + ((raw - xMin) * (yMax - yMin)) / (xMax - xMin);
    }
  } else if (config.method === 'sqrt') {
    // Square Root Curve: y = sqrt(x) * multiplier, capped at maxCap
    const validRaw = Math.max(0, raw);
    computed = Math.sqrt(validRaw) * config.sqrtMultiplier;
  } else if (config.method === 'kkm-threshold') {
    // KKM Threshold Only:
    // Scale scores below KKM so lowest score reaches targetMin (e.g. KKM or designated min)
    const kkm = config.kkm;
    const xMin = config.useActualMinMax ? datasetMin : config.customXMin;
    const xMax = config.useActualMinMax ? datasetMax : config.customXMax;
    const targetMin = config.targetMin;
    const targetMax = config.targetMax;

    if (raw < kkm) {
      if (kkm <= xMin) {
        computed = kkm;
      } else {
        // Linear scale from [xMin, kkm] to [targetMin, kkm]
        computed = targetMin + ((raw - xMin) * (kkm - targetMin)) / Math.max(0.0001, (kkm - xMin));
      }
    } else {
      if (config.kkmScaleAbove) {
        // Smoothly scale from [kkm, xMax] to [kkm, targetMax] to preserve grade rank and prevent ties
        if (xMax <= kkm) {
          computed = raw;
        } else {
          computed = kkm + ((raw - kkm) * (targetMax - kkm)) / Math.max(0.0001, (xMax - kkm));
        }
      } else {
        // Keep scores above KKM intact
        computed = raw;
      }
    }
  } else if (config.method === 'constant-add') {
    computed = raw + config.constantAdd;
  }

  // Ensure within reasonable bounds [0, maxCap]
  computed = Math.max(0, Math.min(config.maxCap, computed));
  return roundScore(computed, config.decimals, config.roundingMode);
}

export function processStudentGrades(
  rawInputs: StudentRawInput[],
  config: ScalingConfig
): StudentGrade[] {
  if (rawInputs.length === 0) return [];

  const rawValues = rawInputs.map((s) => s.rawScore);
  const dataMin = Math.min(...rawValues);
  const dataMax = Math.max(...rawValues);

  return rawInputs.map((input, index) => {
    const scaledScore = computeScaledValue(input.rawScore, config, dataMin, dataMax);
    const delta = roundScore(scaledScore - input.rawScore, config.decimals, 'round');
    const passedBefore = input.rawScore >= config.kkm;
    const passedAfter = scaledScore >= config.kkm;

    return {
      id: input.id,
      originalIndex: index + 1,
      name: input.name || `Student ${index + 1}`,
      rawScore: input.rawScore,
      scaledScore,
      delta,
      passedBefore,
      passedAfter,
    };
  });
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

function calculateStdDev(values: number[], mean: number): number {
  if (values.length <= 1) return 0;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function computeStatistics(grades: StudentGrade[], kkm: number): SummaryStats {
  const count = grades.length;
  if (count === 0) {
    return {
      count: 0,
      rawMean: 0,
      scaledMean: 0,
      rawMedian: 0,
      scaledMedian: 0,
      rawMin: 0,
      scaledMin: 0,
      rawMax: 0,
      scaledMax: 0,
      rawStdDev: 0,
      scaledStdDev: 0,
      rawPassingCount: 0,
      rawPassingRate: 0,
      scaledPassingCount: 0,
      scaledPassingRate: 0,
      avgGain: 0,
      gainPassingCount: 0,
    };
  }

  const rawScores = grades.map((g) => g.rawScore);
  const scaledScores = grades.map((g) => g.scaledScore);

  const rawSum = rawScores.reduce((a, b) => a + b, 0);
  const scaledSum = scaledScores.reduce((a, b) => a + b, 0);

  const rawMean = rawSum / count;
  const scaledMean = scaledSum / count;

  const rawMedian = calculateMedian(rawScores);
  const scaledMedian = calculateMedian(scaledScores);

  const rawMin = Math.min(...rawScores);
  const scaledMin = Math.min(...scaledScores);

  const rawMax = Math.max(...rawScores);
  const scaledMax = Math.max(...scaledScores);

  const rawStdDev = calculateStdDev(rawScores, rawMean);
  const scaledStdDev = calculateStdDev(scaledScores, scaledMean);

  const rawPassingCount = grades.filter((g) => g.passedBefore).length;
  const scaledPassingCount = grades.filter((g) => g.passedAfter).length;

  const rawPassingRate = (rawPassingCount / count) * 100;
  const scaledPassingRate = (scaledPassingCount / count) * 100;

  const avgGain = scaledMean - rawMean;
  const gainPassingCount = scaledPassingCount - rawPassingCount;

  return {
    count,
    rawMean: Number(rawMean.toFixed(2)),
    scaledMean: Number(scaledMean.toFixed(2)),
    rawMedian: Number(rawMedian.toFixed(2)),
    scaledMedian: Number(scaledMedian.toFixed(2)),
    rawMin,
    scaledMin,
    rawMax,
    scaledMax,
    rawStdDev: Number(rawStdDev.toFixed(2)),
    scaledStdDev: Number(scaledStdDev.toFixed(2)),
    rawPassingCount,
    rawPassingRate: Number(rawPassingRate.toFixed(1)),
    scaledPassingCount,
    scaledPassingRate: Number(scaledPassingRate.toFixed(1)),
    avgGain: Number(avgGain.toFixed(2)),
    gainPassingCount,
  };
}
