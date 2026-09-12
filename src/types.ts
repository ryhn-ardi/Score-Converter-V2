export type ScalingMethod = 'linear' | 'sqrt' | 'kkm-threshold' | 'constant-add' | 'cascading-chain';

export type RoundingMode = 'round' | 'floor' | 'ceil';

export type MaxSourceMode = 'auto' | 'custom';
export type MinSourceMode = 'auto' | 'custom';
export type TopScoreProtectionMode = 'none' | 'lock-kkm' | 'damped';
export type CascadeTransitionMode = 'smooth' | 'step';

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
  // Minimum converted score floor (Batas Minimum Nilai Akhir Konversi/Rapor)
  minScaledFloorEnabled: boolean;
  minScaledFloor: number;
  // Anti-inflasi nilai tinggi / perlindungan nilai siswa berkemampuan tinggi
  topScoreProtection: TopScoreProtectionMode;
  dampedStart: number; // Nilai mulai redaman (default KKM atau 75)
  dampedFreezeThreshold: number; // Nilai di mana kenaikan = 0 (misal 90: nilai 90, 91, 95 tidak akan naik)
  dampedMaxBoost: number; // Maksimal kenaikan poin di zona transisi (misal +2 poin)
  // Margin Pembeda Siswa Tuntas (Merit Gap agar siswa nilai asli >= KKM pasti lebih tinggi dari siswa nilai anjlok yang diangkat)
  meritGapEnabled: boolean;
  meritGap: number;
  // Custom Cascading Chain Rule (a < x -> b, a == x -> b + y, c == b + y -> c + z)
  cascadeX: number; // Ambang batas x (misal 75)
  cascadeB: number; // Nilai hasil b jika a < x (misal 75)
  cascadeY: number; // Tambahan y jika nilai pas x (misal 3 -> jadi b + y = 78)
  cascadeC: number; // Ambang batas c (default = b + y, misal 78)
  cascadeCustomC: boolean; // Apakah c di-custom sendiri secara manual
  cascadeZ: number; // Tambahan z jika nilai mencapai c (misal 2 -> jadi c + z = 80)
  cascadeTransition: CascadeTransitionMode; // 'smooth' vs 'step'
  // Batas bonus kenaikan nilai maksimal (Max Delta Cap)
  maxDeltaCapEnabled: boolean;
  maxDeltaCap: number;
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
