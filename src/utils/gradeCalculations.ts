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

  // Resolve source min & max based on user option (auto vs custom)
  const xMin = config.minSourceMode === 'custom' ? config.customXMin : datasetMin;
  const xMax = config.maxSourceMode === 'custom' ? config.customXMax : datasetMax;

  if (config.method === 'linear') {
    const yMin = config.targetMin;
    const yMax = config.targetMax;

    if (config.meritGapEnabled && (config.meritGap ?? 0) > 0 && raw >= config.kkm) {
      // PERLINDUNGAN PEMBEDA SISWA TUNTAS (MERIT GAP):
      // Siswa yang nilai aslinya >= KKM (misal 75) PASTI LEBIH TINGGI daripada siswa nilai anjlok yang diangkat ke KKM
      const kkm = config.kkm;
      const gap = config.meritGap;
      const freeze = Math.max(kkm + gap + 1, config.dampedFreezeThreshold ?? 90);

      if (raw >= freeze) {
        // Nilai tinggi (>= 90) terlindungi: tetap nilai aslinya
        computed = raw;
      } else {
        // Di titik raw = kkm, nilai mulai dari kkm + gap (misal 75 + 3 = 78)
        // lalu melandai mulus menuju freeze (90)
        const t = (raw - kkm) / Math.max(1, freeze - kkm);
        const baseMin = kkm + gap;
        computed = baseMin + t * (freeze - baseMin);
      }
    } else if (config.topScoreProtection === 'lock-kkm' && raw >= config.kkm) {
      // Siswa yang sudah tuntas KKM (misal 90) terlindungi: tetap nilai aslinya, tidak diinflasi
      computed = raw;
    } else if (config.topScoreProtection === 'damped') {
      const start = Math.min(config.dampedStart ?? config.kkm, config.dampedFreezeThreshold ?? 90);
      const freeze = Math.max(start + 1, config.dampedFreezeThreshold ?? 90);
      const maxBoost = config.dampedMaxBoost ?? 2;

      if (raw >= freeze) {
        // PERLINDUNGAN MUTLAK: Nilai >= batas beku (misal 90, 91, 95) SAMA SEKALI TIDAK NAIK (+0)
        computed = raw;
      } else if (raw >= start) {
        // Zona redaman transisi (misal 75 s.d 89): kenaikan dibatasi dan melandai ke 0 di angka freeze
        const standardLinear =
          xMax === xMin ? yMin : yMin + ((raw - xMin) * (yMax - yMin)) / (xMax - xMin);
        const rawGain = Math.max(0, standardLinear - raw);
        const t = (freeze - raw) / (freeze - start); // 1 di start -> 0 di freeze
        const allowedBoost = Math.min(rawGain, maxBoost * Math.pow(t, 1.2));
        computed = raw + allowedBoost;
      } else {
        // Nilai di bawah threshold mulai (misal 30) didongkrak penuh sesuai skala linier
        computed =
          xMax === xMin ? yMin : yMin + ((raw - xMin) * (yMax - yMin)) / (xMax - xMin);
      }
    } else {
      if (xMax === xMin) {
        computed = yMin;
      } else {
        computed = yMin + ((raw - xMin) * (yMax - yMin)) / (xMax - xMin);
      }
    }
  } else if (config.method === 'sqrt') {
    // Square Root Curve: y = sqrt(x) * multiplier, capped at maxCap
    const validRaw = Math.max(0, raw);
    computed = Math.sqrt(validRaw) * config.sqrtMultiplier;
  } else if (config.method === 'kkm-threshold') {
    // KKM Threshold Only:
    // Scale scores below KKM so lowest score reaches targetMin (e.g. KKM or designated min)
    const kkm = config.kkm;
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
      if (config.meritGapEnabled && (config.meritGap ?? 0) > 0) {
        // PERLINDUNGAN PEMBEDA SISWA TUNTAS (MERIT GAP):
        // Siswa yang nilai aslinya >= KKM diangkat lebih tinggi dari batas KKM
        const gap = config.meritGap;
        const freeze = Math.max(kkm + gap + 1, config.dampedFreezeThreshold ?? 90);

        if (raw >= freeze) {
          computed = raw;
        } else {
          const t = (raw - kkm) / Math.max(1, freeze - kkm);
          const baseMin = kkm + gap;
          computed = baseMin + t * (freeze - baseMin);
        }
      } else if (config.topScoreProtection === 'lock-kkm') {
        // Locked: scores >= KKM remain original
        computed = raw;
      } else if (config.topScoreProtection === 'damped') {
        const start = Math.min(config.dampedStart ?? kkm, config.dampedFreezeThreshold ?? 90);
        const freeze = Math.max(start + 1, config.dampedFreezeThreshold ?? 90);
        const maxBoost = config.dampedMaxBoost ?? 2;

        if (raw >= freeze) {
          computed = raw;
        } else if (raw >= start) {
          const standardAbove =
            xMax <= kkm
              ? raw
              : kkm + ((raw - kkm) * (targetMax - kkm)) / Math.max(0.0001, (xMax - kkm));
          const rawGain = Math.max(0, standardAbove - raw);
          const t = (freeze - raw) / (freeze - start);
          const allowedBoost = Math.min(rawGain, maxBoost * Math.pow(t, 1.2));
          computed = raw + allowedBoost;
        } else {
          computed = raw;
        }
      } else if (config.kkmScaleAbove) {
        // Smoothly scale from [kkm, xMax] to [kkm, targetMax]
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
  } else if (config.method === 'cascading-chain') {
    // ATURAN BERJENJANG KUSTOM (CASCADING CHAIN RULE):
    // 1. Jika nilai a < x, maka menjadi b
    // 2. Jika nilai b == x (atau pas titik x), maka b ditambah y (menjadi b + y)
    // 3. Jika nilai c == b + y (atau titik c), maka c ditambah z (menjadi c + z)
    // Semua variabel x, b, y, c, z dapat di-custom oleh pengguna.
    const x = config.cascadeX ?? config.kkm;
    const b = config.cascadeB ?? config.kkm;
    const y = config.cascadeY ?? 3;
    const c = config.cascadeCustomC ? (config.cascadeC ?? (b + y)) : (b + y);
    const z = config.cascadeZ ?? 2;
    const transition = config.cascadeTransition ?? 'smooth';
    const freeze = Math.max(c + z + 1, config.dampedFreezeThreshold ?? 90);

    if (raw < x) {
      // Level 1: Di bawah nilai x -> menjadi b
      computed = b;
    } else if (raw >= x && raw < c) {
      // Level 2: Nilai pas x atau antara x dan c
      if (transition === 'step') {
        computed = raw === x ? (b + y) : (raw + y);
      } else {
        // Mulus interpolasi dari (b + y) di titik x menuju (c + z) di titik c
        if (c <= x) {
          computed = b + y;
        } else {
          const t = (raw - x) / (c - x);
          const valStart = b + y;
          const valEnd = c + z;
          computed = valStart + t * (valEnd - valStart);
        }
      }
    } else {
      // Level 3: Nilai c ke atas (raw >= c) -> c ditambah z
      if (transition === 'step') {
        computed = Math.min(config.maxCap, raw + z);
      } else {
        // Pada titik c: nilainya pas c + z.
        // Untuk raw >= freeze (misal 90): nilai terkunci aman pada nilai asli (tidak melonjak liar)
        if (raw >= freeze) {
          computed = raw;
        } else {
          const t = (raw - c) / Math.max(1, freeze - c);
          const valStart = c + z;
          computed = valStart + t * (freeze - valStart);
        }
      }
    }
  }

  // Batas Maksimal Kenaikan Nilai (Max Delta Cap, jika aktif)
  if (config.maxDeltaCapEnabled && config.maxDeltaCap > 0) {
    if (computed - raw > config.maxDeltaCap) {
      computed = raw + config.maxDeltaCap;
    }
  }

  // Batas Atas Nilai (maxCap, default 100)
  computed = Math.min(config.maxCap, computed);

  // Batas Bawah / Minimum Nilai Akhir Konversi (Floor / minScaledFloor)
  if (config.minScaledFloorEnabled) {
    computed = Math.max(config.minScaledFloor, computed);
  } else {
    computed = Math.max(0, computed);
  }

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
