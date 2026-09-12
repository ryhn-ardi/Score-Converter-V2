import React from 'react';
import { X, BookOpen, CheckCircle2, TrendingUp, Zap, Compass, GitMerge } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 text-slate-800 dark:text-slate-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.guideTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.guideSubtitle}
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          {/* Method A */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>{t.methodA_name}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs my-2 text-slate-800 dark:text-slate-200">
              y = y_min + ((x - x_min) · (y_max - y_min)) / (x_max - x_min)
            </div>
            {language === 'id' ? (
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Cara Kerja:</strong> Memetakan nilai terendah siswa ke target batas bawah (misal KKM 70 atau 75) dan nilai tertinggi siswa ke target batas atas (misal 95 atau 100).
                </li>
                <li>
                  <strong>Pilihan Nilai Maksimal:</strong> Anda dapat memilih memakai <em>Nilai Maksimal Terbaca dari Data</em> (otomatis) agar siswa peringkat pertama mendapat target tertinggi, atau memakai <em>Nilai Maksimal Kustom</em> (misal 100) sebagai standar soal.
                </li>
                <li>
                  <strong>Sifat Matematis:</strong> Linier sempurna. Urutan peringkat siswa dan jarak proporsional antarsiswa 100% terjaga.
                </li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>How it works:</strong> Stretches and maps your class's lowest raw score to your target minimum (e.g. KKM = 70) and highest raw score to your target maximum (e.g. 95 or 100).
                </li>
                <li>
                  <strong>Maximum Score Source:</strong> You can select between <em>Auto-Detected Maximum</em> from data or a <em>Custom Maximum</em> (e.g. 100) as the benchmark ceiling.
                </li>
                <li>
                  <strong>Mathematical Property:</strong> Perfectly linear. Proportional differences and class rank rankings are 100% preserved.
                </li>
              </ul>
            )}
          </div>

          {/* Method B */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 mb-2">
              <Zap className="w-4 h-4" />
              <span>{t.methodB_name}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs my-2 text-slate-800 dark:text-slate-200">
              y = √(x) × 10 (dibatasi maksimum 100)
            </div>
            {language === 'id' ? (
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Cara Kerja:</strong> Fungsi akar kuadrat berbentuk kurva cembung ke bawah. Memberi dongkrakan sangat tinggi pada nilai rendah, dan perlahan mengecil saat mendekati 100.
                </li>
                <li>
                  <strong>Simulasi Contoh:</strong>
                  <span className="block pl-4 font-mono text-[11px] mt-1 text-slate-700 dark:text-slate-300">
                    Nilai 36 → 60 (+24) | Nilai 49 → 70 (+21) | Nilai 64 → 80 (+16) | Nilai 81 → 90 (+9) | Nilai 100 → 100 (+0)
                  </span>
                </li>
                <li>
                  <strong>Cocok Digunakan:</strong> Menyelamatkan banyak siswa yang nilainya anjlok tanpa membuat nilai siswa pintar menjadi berlebihan (meledak).
                </li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>How it works:</strong> The square root function gives a major boost to low scores while tapering off as scores approach 100.
                </li>
                <li>
                  <strong>Example values:</strong>
                  <span className="block pl-4 font-mono text-[11px] mt-1 text-slate-700 dark:text-slate-300">
                    Raw 36 → 60 (+24) | Raw 49 → 70 (+21) | Raw 64 → 80 (+16) | Raw 81 → 90 (+9) | Raw 100 → 100 (+0)
                  </span>
                </li>
                <li>
                  <strong>When to use:</strong> Rescuing failing scores without over-inflating high achievers who already performed well.
                </li>
              </ul>
            )}
          </div>

          {/* Method C */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              <Compass className="w-4 h-4" />
              <span>{t.methodC_name}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs my-2 text-slate-800 dark:text-slate-200">
              Jika x &lt; KKM: y = y_min + ((x - x_min)·(KKM - y_min)) / (KKM - x_min)<br />
              Jika x ≥ KKM: y = x (atau diskalakan mulus ke Target Max)
            </div>
            {language === 'id' ? (
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Cara Kerja:</strong> Fokus pada penyesuaian nilai siswa remedial yang belum tuntas, dengan mengangkat nilai terendah ke target min menuju KKM.
                </li>
                <li>
                  <strong>Opsi Penjagaan Peringkat:</strong> Tersedia opsi untuk menskalakan siswa di atas KKM secara proporsional agar siswa yang lulus murni tetap memiliki keunggulan adil.
                </li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>How it works:</strong> Focuses specifically on remedial recovery for students who fell short of KKM, bringing the lowest student up to y_min and scaling up to KKM.
                </li>
                <li>
                  <strong>Smooth transition option:</strong> Allows preserving rank order above KKM so that students who earned high scores maintain a fair advantage.
                </li>
              </ul>
            )}
          </div>

          {/* Method D: Cascading Chain Rules */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 mb-2">
              <GitMerge className="w-4 h-4" />
              <span>{t.methodE_name}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 font-mono text-xs my-2 text-slate-800 dark:text-slate-200 border border-blue-200 dark:border-blue-900">
              1. Jika Nilai Asli &lt; x → Menjadi b<br />
              2. Jika Nilai Asli = x → Menjadi b + y<br />
              3. Jika Nilai Asli = c (default b + y) → Menjadi c + z<br />
              4. Nilai Tinggi (&gt; c s.d 100) → Melandai proporsional (anti lonjakan)
            </div>
            {language === 'id' ? (
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                <li>
                  <strong>Sesuai Permintaan Guru:</strong> Menyelesaikan masalah keadilan siswa tuntas murni vs siswa remedial. Siswa di bawah x terangkat ke b, namun siswa yang mencapai x murni tetap lebih tinggi (b + y), dan jenjang seterusnya (c + z).
                </li>
                <li>
                  <strong>Fleksibilitas Penuh:</strong> Anda dapat mengkustomisasi semua variabel x, b, y, c, z sesuai regulasi dan pedoman penilaian sekolah Anda.
                </li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                <li>
                  <strong>Custom Chain Logic:</strong> Guarantees that students scoring below x are raised to b, while students legitimately reaching x get b + y, and students at c get c + z.
                </li>
                <li>
                  <strong>Total Customizability:</strong> All threshold variables x, b, y, c, z are fully customizable to align with your school grading standards.
                </li>
              </ul>
            )}
          </div>

          {/* Anti-Inflation & Floor Guide */}
          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 text-xs">
            <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-300 mb-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>
                {language === 'id'
                  ? 'Solusi Khusus: Nilai Anjlok (30) vs Nilai Tinggi (90+)'
                  : 'Special Solution: Low Failing Scores (30) vs High Achievers (90+)'}
              </span>
            </div>
            {language === 'id' ? (
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <p>
                  <strong>Pertanyaan Guru:</strong> <em>"Jika ada nilai anjlok 30 lalu didongkrak, nilai 90 ke atas ikut terangkat jadi 95–97 padahal kemampuan aslinya tidak setinggi itu dan rapor jadi mirip-mirip. Bagaimana solusinya?"</em>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 font-medium">
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-800/80">
                    <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">
                      1. Kunci Nilai Tuntas
                    </span>
                    Nilai $\ge$ KKM (misal 90) TETAP 90! Hanya siswa &lt; KKM yang didongkrak.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-800/80">
                    <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">
                      2. Batas Kunci Teredam (Freeze)
                    </span>
                    Pilih <strong>Kenaikan Teredam</strong> lalu setel Freeze Threshold = 90. Nilai 91, 92, 95 dijamin mendapat <strong>+0 kenaikan</strong> (terkunci nilai asli).
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-800/80">
                    <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">
                      3. Batas Bawah Rapor (Floor)
                    </span>
                    Tetapkan rapor minimal (misal 65). Siswa 30 otomatis jadi 65 tanpa menggeser kurva atas.
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50/90 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">
                      4. Pembeda Tuntas (Merit Gap)
                    </span>
                    Jika siswa 30 diangkat ke 75, siswa yang aslinya 75 otomatis dapat <strong>78</strong> (+3 pt pembeda) agar prestasinya tetap dihargai lebih tinggi!
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <p>
                  <strong>Teacher Dilemma:</strong> <em>"When raw scores are very low (e.g. 30), standard linear scaling can inflate high scores (e.g. 90 becomes 95-97), compressing the grade spread. How do I fix this?"</em>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 font-medium">
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-800/80">
                    <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">
                      1. Lock Passing Scores (Top Recommendation)
                    </span>
                    Select <strong>"Lock Passing Scores"</strong> in the High-Score Protection panel. A raw score of 90 stays 90, and only failing grades are elevated.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-800/80">
                    <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">
                      2. Final Converted Score Floor
                    </span>
                    Turn on the <strong>"Final Score Floor"</strong> to clamp the lowest possible grade on report cards (e.g. 65), guaranteeing school compliance without skewing top achievers.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Practical Tips */}
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200">
            <h4 className="font-bold flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              {language === 'id' ? 'Saran Terbaik untuk Guru' : 'Pedagogical Best Practices'}
            </h4>
            <p className="text-xs leading-relaxed text-indigo-900/90 dark:text-indigo-300">
              {language === 'id'
                ? 'Selalu simpan arsip nilai asli berdampingan dengan nilai konversi (ekspor Excel sudah menyertakan kedua kolom secara otomatis). Cantumkan metode yang digunakan pada catatan administrasi atau jurnal remedial penilaian.'
                : 'Always archive the raw scores alongside the scaled scores (the exported Excel file includes both columns automatically). Document which scaling method was selected in your semester lesson logbook or remedial assessment report.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
          >
            {t.guideClose}
          </button>
        </div>
      </div>
    </div>
  );
};
