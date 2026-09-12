import * as XLSX from 'xlsx';
import { StudentGrade, StudentRawInput } from '../types';

/**
 * Parses raw text pasted from Excel, Google Sheets, CSV or single line inputs.
 */
export function parsePastedText(text: string): StudentRawInput[] {
  if (!text || !text.trim()) return [];

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const results: StudentRawInput[] = [];

  let isHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Determine delimiter: tab, comma, semicolon, or whitespace
    let parts: string[];
    if (line.includes('\t')) {
      parts = line.split('\t').map((p) => p.trim());
    } else if (line.includes(';')) {
      parts = line.split(';').map((p) => p.trim());
    } else if (line.includes(',')) {
      parts = line.split(',').map((p) => p.trim());
    } else {
      // Space separated if there's both letters and numbers
      parts = line.split(/\s{2,}|\s+/).map((p) => p.trim());
    }

    // Filter out empty parts
    parts = parts.filter((p) => p.length > 0);
    if (parts.length === 0) continue;

    // First line header check
    if (isHeader && i === 0) {
      const lower = line.toLowerCase();
      const looksLikeHeader =
        lower.includes('name') ||
        lower.includes('nama') ||
        lower.includes('siswa') ||
        lower.includes('student') ||
        lower.includes('score') ||
        lower.includes('nilai') ||
        lower.includes('grade') ||
        lower.includes('kkm');

      const anyPartIsNumeric = parts.some((p) => !isNaN(parseFloat(p.replace(',', '.'))));
      if (looksLikeHeader && !anyPartIsNumeric) {
        isHeader = false;
        continue;
      }
      isHeader = false;
    }

    // Identify which part is the score (usually the numeric part, or the last numeric part)
    let scoreIndex = -1;
    let scoreVal = 0;

    // Scan backwards to find the score
    for (let p = parts.length - 1; p >= 0; p--) {
      const cleanNumStr = parts[p].replace(',', '.').replace(/[^0-9.-]/g, '');
      const num = parseFloat(cleanNumStr);
      if (!isNaN(num) && num >= 0 && num <= 1000) {
        scoreIndex = p;
        scoreVal = num;
        break;
      }
    }

    if (scoreIndex === -1) {
      // Line doesn't contain a valid numeric score
      continue;
    }

    // Other parts make up the name
    let name = '';
    const nameParts = parts.filter((_, idx) => idx !== scoreIndex);

    // If first part was just a number like "1.", "2.", discard row numbering
    if (
      nameParts.length > 1 &&
      /^\d+[\.\)]?$/.test(nameParts[0])
    ) {
      nameParts.shift();
    }

    name = nameParts.join(' ').replace(/^[0-9]+[\.\)]\s*/, '').trim();

    results.push({
      id: `std_${Date.now()}_${results.length}_${Math.random().toString(36).substring(2, 6)}`,
      name: name || `Student ${results.length + 1}`,
      rawScore: scoreVal,
    });
  }

  return results;
}

/**
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file.
 */
export async function parseUploadedFile(file: File): Promise<StudentRawInput[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  // Use the first worksheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to JSON 2D array
  const rawData: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
  });

  if (!rawData || rawData.length === 0) {
    throw new Error('File is empty or contains no readable sheets.');
  }

  const results: StudentRawInput[] = [];
  let headerRowIndex = -1;
  let nameColIndex = -1;
  let scoreColIndex = -1;

  // Search first 5 rows for header row
  for (let r = 0; r < Math.min(5, rawData.length); r++) {
    const row = rawData[r];
    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c] || '').toLowerCase().trim();
      if (
        (cell.includes('nama') || cell.includes('name') || cell.includes('siswa') || cell.includes('student')) &&
        nameColIndex === -1
      ) {
        nameColIndex = c;
        headerRowIndex = r;
      }
      if (
        (cell.includes('nilai') || cell.includes('score') || cell.includes('grade') || cell.includes('hasil')) &&
        scoreColIndex === -1
      ) {
        scoreColIndex = c;
        headerRowIndex = r;
      }
    }
    if (scoreColIndex !== -1) break;
  }

  const startRow = headerRowIndex !== -1 ? headerRowIndex + 1 : 0;

  for (let r = startRow; r < rawData.length; r++) {
    const row = rawData[r];
    if (!row || row.length === 0) continue;

    let score = 0;
    let scoreFound = false;
    let name = '';

    if (scoreColIndex !== -1 && row[scoreColIndex] !== undefined && row[scoreColIndex] !== '') {
      const val = parseFloat(String(row[scoreColIndex]).replace(',', '.'));
      if (!isNaN(val)) {
        score = val;
        scoreFound = true;
      }
    }

    if (nameColIndex !== -1 && row[nameColIndex] !== undefined) {
      name = String(row[nameColIndex]).trim();
    }

    // Fallback if specific columns weren't identified
    if (!scoreFound) {
      for (let c = row.length - 1; c >= 0; c--) {
        const val = parseFloat(String(row[c]).replace(',', '.'));
        if (!isNaN(val) && val >= 0) {
          score = val;
          scoreFound = true;
          // Look for text in other columns for name
          if (!name) {
            const possibleNames = row
              .filter((_, idx) => idx !== c)
              .map((p) => String(p).trim())
              .filter((p) => p.length > 0 && isNaN(parseFloat(p)));
            name = possibleNames.join(' ');
          }
          break;
        }
      }
    }

    if (scoreFound) {
      results.push({
        id: `std_file_${r}_${Math.random().toString(36).substring(2, 6)}`,
        name: name || `Student ${results.length + 1}`,
        rawScore: score,
      });
    }
  }

  if (results.length === 0) {
    throw new Error('Could not find any student grades in the uploaded file.');
  }

  return results;
}

/**
 * Exports converted grades to an Excel (.xlsx) file with styling.
 */
export function exportToExcel(
  grades: StudentGrade[],
  kkm: number,
  methodName: string,
  fileName: string = 'scaled_student_grades.xlsx'
) {
  const data = grades.map((g) => ({
    'No': g.originalIndex,
    'Student Name': g.name,
    'Raw Score (Nilai Asli)': g.rawScore,
    'Scaled Score (Nilai Konversi)': g.scaledScore,
    'Delta (+/-)': g.delta > 0 ? `+${g.delta}` : g.delta,
    'Status Before KKM': g.passedBefore ? 'Tuntas' : 'Belum Tuntas',
    'Status After KKM': g.passedAfter ? 'Tuntas' : 'Belum Tuntas',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-fit column widths
  const colWidths = [
    { wch: 6 },  // No
    { wch: 28 }, // Name
    { wch: 22 }, // Raw Score
    { wch: 25 }, // Scaled Score
    { wch: 12 }, // Delta
    { wch: 18 }, // Status Before
    { wch: 18 }, // Status After
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Converted Grades');

  // Add Summary sheet
  const rawSum = grades.reduce((a, b) => a + b.rawScore, 0);
  const scaledSum = grades.reduce((a, b) => a + b.scaledScore, 0);
  const count = grades.length;
  const rawMean = count > 0 ? (rawSum / count).toFixed(2) : '0';
  const scaledMean = count > 0 ? (scaledSum / count).toFixed(2) : '0';
  const rawPassing = grades.filter((g) => g.passedBefore).length;
  const scaledPassing = grades.filter((g) => g.passedAfter).length;

  const summaryData = [
    { 'Metric': 'Scaling Method', 'Value': methodName },
    { 'Metric': 'Passing Grade (KKM)', 'Value': kkm },
    { 'Metric': 'Total Students', 'Value': count },
    { 'Metric': 'Average Raw Score', 'Value': rawMean },
    { 'Metric': 'Average Scaled Score', 'Value': scaledMean },
    { 'Metric': 'Passing Count (Before)', 'Value': `${rawPassing} / ${count} (${((rawPassing / (count || 1)) * 100).toFixed(1)}%)` },
    { 'Metric': 'Passing Count (After)', 'Value': `${scaledPassing} / ${count} (${((scaledPassing / (count || 1)) * 100).toFixed(1)}%)` },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Scaling Summary');

  XLSX.writeFile(workbook, fileName);
}

/**
 * Exports converted grades to CSV format.
 */
export function exportToCSV(grades: StudentGrade[], fileName: string = 'scaled_student_grades.csv') {
  const headers = ['No', 'Student Name', 'Raw Score', 'Scaled Score', 'Delta', 'Status Before', 'Status After'];
  const rows = grades.map((g) => [
    g.originalIndex,
    `"${g.name.replace(/"/g, '""')}"`,
    g.rawScore,
    g.scaledScore,
    g.delta,
    g.passedBefore ? 'Tuntas' : 'Belum Tuntas',
    g.passedAfter ? 'Tuntas' : 'Belum Tuntas',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies the converted table as Tab-Separated Values (TSV) directly to clipboard.
 * Perfect for direct pasting into Microsoft Excel or Google Sheets.
 */
export async function copyToClipboardForExcel(grades: StudentGrade[]): Promise<boolean> {
  const headers = ['No', 'Nama Siswa', 'Nilai Asli', 'Nilai Konversi', 'Selisih', 'Status Kelulusan'];
  const rows = grades.map((g) => [
    g.originalIndex,
    g.name,
    g.rawScore,
    g.scaledScore,
    g.delta >= 0 ? `+${g.delta}` : g.delta,
    g.passedAfter ? 'Tuntas (KKM)' : 'Belum Tuntas',
  ]);

  const tsvText = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(tsvText);
      return true;
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = tsvText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
