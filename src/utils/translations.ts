export type Language = 'id' | 'en';

export const translations = {
  id: {
    // Header & Navbar
    appTitle: 'Konverter & Pendongkrak Nilai Siswa',
    badgeTeacher: 'Edisi Guru',
    appSubtitle: 'Konversi & Dongkrak Nilai Siswa Sesuai KKM (Kriteria Ketuntasan Minimal)',
    btnGuide: 'Panduan Rumus',
    btnPrint: 'Cetak Laporan',
    btnSample: 'Muat Contoh Kelas',
    btnClear: 'Hapus Semua',
    themeDark: 'Mode Gelap',
    themeLight: 'Mode Terang',
    langToggle: 'Bahasa',

    // Assessment title
    assessmentLabel: 'Mata Pelajaran / Penilaian:',
    activeEngine: 'Metode Aktif:',

    // Data Input Section
    inputTitle: 'Input & Impor Nilai Siswa',
    inputSubtitle: 'Salin-tempel langsung dari Excel/Spreadsheet, unggah file, atau tambah manual.',
    tabPaste: 'Tempel dari Excel / Sheets',
    tabUpload: 'Unggah File (.xlsx / .csv)',
    tabQuickAdd: 'Tambah Siswa Cepat',
    textareaPlaceholder: `Tempel baris nilai dari Excel atau Google Sheets di sini, contoh:
Budi Santoso\t65
Siti Rahma\t82
Ahmad Fauzi\t54
-- ATAU angka nilai saja per baris:
65
82
54`,
    detectedStudents: 'Terdeteksi {count} siswa',
    autoDetectNotice: 'Otomatis mendeteksi nama siswa jika ada di samping nilai (tab, koma, spasi, atau baris baru).',
    btnAppend: 'Tambahkan ({count} ada)',
    btnApplyReplace: 'Terapkan Nilai (Ganti)',
    dropTitle: 'Klik untuk memilih atau seret file spreadsheet ke sini',
    dropSubtitle: 'Mendukung file .xlsx, .xls, dan .csv. Kolom nama dan nilai siswa dideteksi otomatis!',
    quickNameLabel: 'Nama Siswa (Opsional)',
    quickScoreLabel: 'Nilai Asli (0 - 100)',
    btnAddStudent: 'Tambah Siswa',
    msgLoadedSuccess: 'Berhasil memuat {count} data nilai siswa!',
    msgImportSuccess: 'Berhasil mengimpor {count} siswa dari {fileName}',
    msgNoScoresFound: 'Tidak ditemukan angka nilai yang valid.',

    // Scaling Controls
    controlsTitle: 'Parameter Konversi & Skala Nilai',
    controlsSubtitle: 'Pilih metode matematis dan sesuaikan parameter secara langsung (real-time).',
    kkmLabel: 'Standar KKM',
    kkmSubLabel: 'Batas Nilai Tuntas',
    selectEngine: 'Pilih Mesin Konversi',

    // Method A
    methodA_name: 'Metode A: Skala Linear (Min-Max)',
    methodA_desc: 'Menginterpolasi nilai ke Target Min (misal 70) dan Target Max (misal 95) dengan tetap menjaga proporsi selisih nilai.',
    methodA_formula: 'y = y_min + ((x - x_min) · Δy) / Δx',

    // Method B
    methodB_name: 'Metode B: Kurva Akar Kuadrat (Dongkrak Bawah)',
    methodB_desc: 'Kurva klasik pendongkrak nilai bawah. Memberikan lonjakan besar untuk nilai rendah dan semakin mengecil mendekati 100.',
    methodB_formula: 'y = √(x) × pengali (maks: 100)',

    // Method C
    methodC_name: 'Metode C: Khusus Ambang KKM (Remedial)',
    methodC_desc: 'Fokus mendongkrak siswa di bawah KKM agar mencapai batas tuntas, sementara nilai yang sudah tuntas tetap terjaga.',
    methodC_formula: 'Skala piecewise untuk nilai x < KKM',

    // Parameters details
    paramLinearTitle: 'Pengaturan Skala Linear (Min-Max)',
    targetMinLabel: 'Target Nilai Terendah (y_min)',
    targetMinHint: 'Siswa dengan nilai terendah akan mendapat nilai ini (misal KKM {kkm})',
    targetMaxLabel: 'Target Nilai Tertinggi (y_max)',
    targetMaxHint: 'Siswa dengan nilai tertinggi akan mendapat nilai ini (misal 95 atau 100)',

    // Max & Min Source Selection (Feature requested by user)
    maxSourceTitle: 'Pilihan Sumber Nilai Maksimal (x_max)',
    maxSourceAuto: 'Gunakan Nilai Maksimal Terdeteksi dari Data',
    maxSourceCustom: 'Gunakan Nilai Maksimal Kustom',
    detectedMaxBadge: 'Nilai Maksimal Terbaca: {val}',
    customMaxLabel: 'Batas Maksimal Kustom',
    customMaxHint: 'Misal nilai sempurna ujian = 100',

    minSourceTitle: 'Pilihan Sumber Nilai Minimal (x_min)',
    minSourceAuto: 'Otomatis dari data terendah ({val})',
    minSourceCustom: 'Nilai minimal kustom',

    sqrtMultiplierLabel: 'Faktor Pengali Akar (Default = 10)',
    sqrtMultiplierHint: 'Contoh: Nilai asli 49 menjadi {val} | 64 menjadi {val2}',
    maxCapLabel: 'Batas Nilai Maksimum (Ceiling)',
    maxCapHint: 'Mencegah nilai hasil konversi melebihi batas ini (misal 100)',

    kkmTargetMinLabel: 'Target Min Siswa Remedial (y_min)',
    kkmTargetMinHint: 'Nilai terendah akan diangkat ke angka ini menuju KKM ({kkm})',
    kkmAboveTitle: 'Penanganan Siswa yang Sudah Tuntas (x ≥ KKM)',
    kkmAboveSmooth: 'Skala mulus dari KKM ke {targetMax} (Menjaga urutan peringkat kelas)',
    kkmAboveKeep: 'Biarkan tetap (Nilai asli siswa yang sudah tuntas tidak diubah)',

    // Precision & Rounding
    roundingTitle: 'Opsi Pembulatan & Desimal',
    decimalsLabel: 'Jumlah Desimal',
    integerOption: 'Bulat (0)',
    roundingModeLabel: 'Mode Pembulatan',
    roundModeStandard: 'Standar (Round)',
    roundModeFloor: 'Ke Bawah (Floor)',
    roundModeCeil: 'Ke Atas (Ceil)',

    // Simulator
    simulatorTitle: 'Simulator Konversi Langsung',
    simulatorDragHint: 'Geser untuk simulasi nilai apapun',
    rawTestLabel: 'Tes Nilai Asli:',
    convertedResultLabel: 'Hasil Konversi',
    statusPassed: '✓ Tuntas KKM',
    statusFailed: '✗ Belum Tuntas',

    // Comparative Stats
    statsTitle: 'Statistik Perbandingan (Sebelum vs Sesudah)',
    studentsCountLabel: '{count} Siswa | KKM = {kkm}',
    statPassingRate: 'Tingkat Ketuntasan (KKM)',
    statClassMean: 'Rata-Rata Kelas (Mean)',
    statRange: 'Rentang Nilai (Min – Max)',
    statMedianStd: 'Median & Sebaran (Std Dev)',
    statRaw: 'Asli:',
    statPassedCount: '{count} tuntas',
    statUnchanged: 'Tetap',
    statNewPassed: '{count} tuntas baru',
    statMinBoost: 'Kenaikan Min: +{val}',
    statAvgGain: 'Kenaikan rata-rata',

    // Chart
    chartTitle: 'Grafik Pergeseran Distribusi Nilai',
    chartSubtitle: 'Bandingkan persebaran nilai sebelum dan sesudah dikonversi, atau lihat kurva fungsi matematisnya.',
    chartTabHistogram: 'Histogram Distribusi',
    chartTabCurve: 'Kurva Transformasi (x → y)',
    chartLegendRaw: 'Nilai Asli (Sebelum)',
    chartLegendScaled: 'Nilai Konversi (Sesudah)',
    chartLegendIdentity: 'Garis Asli (y = x acuan)',
    chartYAxis: 'Jumlah Siswa',
    chartXAxisRaw: 'Nilai Asli (x)',
    chartYAxisScaled: 'Nilai Konversi (y)',
    chartFooterHistogram: 'Standar KKM berada pada angka {kkm}. Perhatikan pergeseran siswa dari zona merah ke zona tuntas.',
    chartFooterCurve: 'Kurva menunjukkan fungsi transfer matematika. Nilai di atas garis putus-putus mendapat dongkrakan.',

    // Table & Results
    tableTitle: 'Tabel & Hasil Nilai Siswa',
    tableSubtitle: 'Klik baris siswa untuk mengedit nilai asli atau nama secara langsung. Urutkan, saring, dan ekspor ke Excel.',
    btnCopyExcel: 'Salin untuk Excel',
    btnCopied: 'Tersalin ke Clipboard!',
    btnExportExcel: 'Unduh Excel (.xlsx)',
    btnExportCSV: 'Unduh CSV',
    searchPlaceholder: 'Cari nama siswa...',
    filterAll: 'Semua Siswa',
    filterRemedial: 'Nilai Asli < KKM (Remedial)',
    filterPassed: 'Nilai Asli Tuntas',
    thNo: 'No',
    thName: 'Nama Siswa',
    thRaw: 'Nilai Asli',
    thScaled: 'Nilai Konversi',
    thDelta: 'Selisih (Δ)',
    thStatus: 'Status KKM',
    thActions: 'Aksi',
    statusBadgeTuntas: 'Tuntas',
    statusBadgeBelum: 'Belum',
    showingPagination: 'Menampilkan {start} - {end} dari {total} siswa',

    // Formula Guide Modal
    guideTitle: 'Panduan Matematis Konversi & Dongkrak Nilai',
    guideSubtitle: 'Pedoman Bagi Guru dalam Memilih dan Melaporkan Penyesuaian Nilai',
    guideClose: 'Tutup Panduan',

    // Print Header
    printReportTitle: 'Laporan Rekapitulasi & Konversi Nilai Siswa',
    printSubject: 'Mata Pelajaran / Ujian:',
    printMethod: 'Metode Konversi:',
    printKKM: 'Standar KKM:',
    printDate: 'Tanggal Cetak:',
    printSignature: 'Tanda Tangan Guru Pengampu',
  },
  en: {
    // Header & Navbar
    appTitle: 'Student Grade Converter & Scaler',
    badgeTeacher: 'Teacher Edition',
    appSubtitle: 'Scale, boost, and convert student scores to meet Minimum Passing Grade (KKM)',
    btnGuide: 'Formula Guide',
    btnPrint: 'Print Report',
    btnSample: 'Load Sample Class',
    btnClear: 'Clear All',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    langToggle: 'Language',

    // Assessment title
    assessmentLabel: 'Assessment / Subject:',
    activeEngine: 'Active Engine:',

    // Data Input Section
    inputTitle: 'Input & Import Student Grades',
    inputSubtitle: 'Copy-paste directly from Excel/Sheets, upload a spreadsheet, or add entries manually.',
    tabPaste: 'Paste from Excel / Sheets',
    tabUpload: 'Upload File (.xlsx / .csv)',
    tabQuickAdd: 'Quick Add Student',
    textareaPlaceholder: `Paste rows directly here from Excel or Google Sheets, for example:
Budi Santoso\t65
Siti Rahma\t82
Ahmad Fauzi\t54
-- OR simple raw numbers:
65
82
54`,
    detectedStudents: 'Detected {count} students',
    autoDetectNotice: 'Auto-detects student names if present alongside scores (tab, comma, space, or newline separated).',
    btnAppend: 'Append ({count} existing)',
    btnApplyReplace: 'Apply Grades (Replace)',
    dropTitle: 'Click to browse or drag & drop your spreadsheet file',
    dropSubtitle: 'Supports .xlsx, .xls, and .csv. Automatically detects Student Name and Score columns!',
    quickNameLabel: 'Student Name (Optional)',
    quickScoreLabel: 'Raw Score (0 - 100)',
    btnAddStudent: 'Add Student',
    msgLoadedSuccess: 'Successfully loaded {count} student records!',
    msgImportSuccess: 'Successfully imported {count} students from {fileName}',
    msgNoScoresFound: 'No valid numeric grades were found.',

    // Scaling Controls
    controlsTitle: 'Conversion & Scaling Parameters',
    controlsSubtitle: 'Choose a mathematical scaling method and calibrate thresholds in real-time.',
    kkmLabel: 'KKM Passing Grade',
    kkmSubLabel: 'Passing Threshold',
    selectEngine: 'Select Scaling Engine',

    // Method A
    methodA_name: 'Method A: Linear Scaling (Min-Max)',
    methodA_desc: 'Interpolates grades into a Target Min (e.g. 70) and Target Max (e.g. 95) while preserving proportional distances.',
    methodA_formula: 'y = y_min + ((x - x_min) · Δy) / Δx',

    // Method B
    methodB_name: 'Method B: Square Root Curve',
    methodB_desc: 'Classic "Dongkrak Nilai Bawah". Gives a larger boost to lower scores while tapering off as scores approach 100.',
    methodB_formula: 'y = √(x) × multiplier (cap: 100)',

    // Method C
    methodC_name: 'Method C: KKM Threshold Only',
    methodC_desc: 'Focuses specifically on students below KKM to bring them to passing, keeping already passing grades intact or smoothly adjusted.',
    methodC_formula: 'Piecewise boost for x < KKM',

    // Parameters details
    paramLinearTitle: 'Linear Min-Max Parameters',
    targetMinLabel: 'Target Min (y_min)',
    targetMinHint: 'Lowest student gets this score (e.g. KKM {kkm})',
    targetMaxLabel: 'Target Max (y_max)',
    targetMaxHint: 'Highest student gets this score (e.g. 95 or 100)',

    // Max & Min Source Selection (Feature requested by user)
    maxSourceTitle: 'Maximum Score Source (x_max)',
    maxSourceAuto: 'Use Auto-Detected Maximum from Data',
    maxSourceCustom: 'Use Custom Maximum Score',
    detectedMaxBadge: 'Detected Max Score: {val}',
    customMaxLabel: 'Custom Max Score',
    customMaxHint: 'e.g. Exam perfect score = 100',

    minSourceTitle: 'Minimum Score Source (x_min)',
    minSourceAuto: 'Auto-detected lowest score ({val})',
    minSourceCustom: 'Custom minimum score',

    sqrtMultiplierLabel: 'Square Root Multiplier (Default = 10)',
    sqrtMultiplierHint: 'Example: Raw 49 becomes {val} | 64 becomes {val2}',
    maxCapLabel: 'Maximum Score Cap',
    maxCapHint: 'Prevents any boosted score from exceeding this ceiling (e.g. 100)',

    kkmTargetMinLabel: 'Target Min for Failing Scores (y_min)',
    kkmTargetMinHint: 'Lowest score will scale to this value towards KKM ({kkm})',
    kkmAboveTitle: 'Handling for Passing Scores (x ≥ KKM)',
    kkmAboveSmooth: 'Scale smoothly from KKM to {targetMax} (Preserves rank order)',
    kkmAboveKeep: 'Keep original scores intact',

    // Precision & Rounding
    roundingTitle: 'Rounding & Precision Options',
    decimalsLabel: 'Decimal Places',
    integerOption: 'Integer (0)',
    roundingModeLabel: 'Rounding Mode',
    roundModeStandard: 'Standard (Round)',
    roundModeFloor: 'Round Down (Floor)',
    roundModeCeil: 'Round Up (Ceil)',

    // Simulator
    simulatorTitle: 'Live Score Simulator',
    simulatorDragHint: 'Drag to test any score',
    rawTestLabel: 'Test Raw Score:',
    convertedResultLabel: 'Converted Score',
    statusPassed: '✓ Passed KKM',
    statusFailed: '✗ Below KKM',

    // Comparative Stats
    statsTitle: 'Comparative Statistics (Before vs. After)',
    studentsCountLabel: '{count} Students | KKM = {kkm}',
    statPassingRate: 'Passing Rate (KKM)',
    statClassMean: 'Class Mean (Average)',
    statRange: 'Score Range (Min – Max)',
    statMedianStd: 'Median & Spread (Std Dev)',
    statRaw: 'Raw:',
    statPassedCount: '{count} passed',
    statUnchanged: 'Unchanged',
    statNewPassed: '{count} new passed',
    statMinBoost: 'Min Boost: +{val}',
    statAvgGain: 'Average gain',

    // Chart
    chartTitle: 'Visual Grade Distribution Shift',
    chartSubtitle: 'Compare score distribution before and after scaling, or view the mathematical transfer curve.',
    chartTabHistogram: 'Distribution Histogram',
    chartTabCurve: 'Transformation Curve (x → y)',
    chartLegendRaw: 'Raw Scores (Before)',
    chartLegendScaled: 'Scaled Scores (After)',
    chartLegendIdentity: 'Original (y = x reference)',
    chartYAxis: 'Number of Students',
    chartXAxisRaw: 'Raw Score (x)',
    chartYAxisScaled: 'Scaled Score (y)',
    chartFooterHistogram: 'KKM benchmark set at {kkm}. Notice the shift from failing brackets into passing ranges.',
    chartFooterCurve: 'The curve illustrates the formula transfer function. Scores above the dotted line received a boost.',

    // Table & Results
    tableTitle: 'Student Grade Table & Results',
    tableSubtitle: 'Click any student to edit directly in-table. Sort, filter, and export into Excel or CSV.',
    btnCopyExcel: 'Copy for Excel',
    btnCopied: 'Copied to Clipboard!',
    btnExportExcel: 'Excel (.xlsx)',
    btnExportCSV: 'CSV',
    searchPlaceholder: 'Search student name...',
    filterAll: 'All Students',
    filterRemedial: 'Raw Below KKM',
    filterPassed: 'Raw Passed',
    thNo: 'No',
    thName: 'Student Name',
    thRaw: 'Raw Score',
    thScaled: 'Scaled Score',
    thDelta: 'Delta (Δ)',
    thStatus: 'KKM Status',
    thActions: 'Actions',
    statusBadgeTuntas: 'Passed',
    statusBadgeBelum: 'Failed',
    showingPagination: 'Showing {start} to {end} of {total} students',

    // Formula Guide Modal
    guideTitle: 'Grade Scaling & Conversion Guide for Teachers',
    guideSubtitle: 'Mathematical & Pedagogical Guidelines for Grade Adjustments',
    guideClose: 'Close Guide',

    // Print Header
    printReportTitle: 'Student Grade Scaling & Conversion Summary Report',
    printSubject: 'Assessment / Exam:',
    printMethod: 'Scaling Method:',
    printKKM: 'Passing Standard (KKM):',
    printDate: 'Print Date:',
    printSignature: 'Teacher / Instructor Signature',
  },
};
