export type ScalingMethod = 'linear' | 'sqrt' | 'kkm-threshold' | 'constant-add';

export type RoundingMode = 'round' | 'floor' | 'ceil';

export type MaxSourceMode = 'auto' | 'custom';
export type MinSourceMode = 'auto' | 'custom';

export interface ScalingConfig {
  method: ScalingMethod;
  kkm: number;
  targetMin: number;
  targetMax: number;
  // Maximum score source option (auto-detected vs custom)
  maxSourceMode: MaxSourceMode;
  customXMax: number;
  // Minimum score source option (auto-detected vs custom)
  minSourceMode: MinSourceMode;
  customXMin: number;
  sqrtMultiplier: number;
  maxCap: number;
  kkmScaleAbove: boolean; // For KKM piecewise: smooth scaling for scores above KKM
  constantAdd: number;
  decimals: 0 | 1 | 2;
  roundingMode: RoundingMode;
}

export interface StudentRawInput {
  id: string;
  name: string;
  rawScore: number;
}

export interface StudentGrade {
  id: string;
  originalIndex: number;
  name: string;
  rawScore: number;
  scaledScore: number;
  delta: number;
  passedBefore: boolean;
  passedAfter: boolean;
}

export interface SummaryStats {
  count: number;
  rawMean: number;
  scaledMean: number;
  rawMedian: number;
  scaledMedian: number;
  rawMin: number;
  scaledMin: number;
  rawMax: number;
  scaledMax: number;
  rawStdDev: number;
  scaledStdDev: number;
  rawPassingCount: number;
  rawPassingRate: number;
  scaledPassingCount: number;
  scaledPassingRate: number;
  avgGain: number;
  gainPassingCount: number;
}

export interface HistogramBin {
  label: string;
  min: number;
  max: number;
  rawCount: number;
  scaledCount: number;
}
