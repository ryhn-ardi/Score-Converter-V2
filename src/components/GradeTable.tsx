import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Copy,
  Check,
  FileSpreadsheet,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { StudentGrade } from '../types';
import { copyToClipboardForExcel, exportToCSV, exportToExcel } from '../utils/fileParser';
import { Language, translations } from '../utils/translations';

interface GradeTableProps {
  grades: StudentGrade[];
  kkm: number;
  methodName: string;
  onUpdateRawScore: (id: string, newScore: number) => void;
  onUpdateName: (id: string, newName: string) => void;
  onDeleteStudent: (id: string) => void;
  language: Language;
}

type SortField = 'originalIndex' | 'name' | 'rawScore' | 'scaledScore' | 'delta' | 'passedAfter';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'remedial' | 'passed' | 'boosted';

export const GradeTable: React.FC<GradeTableProps> = ({
  grades,
  kkm,
  methodName,
  onUpdateRawScore,
  onUpdateName,
  onDeleteStudent,
  language,
}) => {
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('originalIndex');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [copySuccess, setCopySuccess] = useState(false);

  // In-table editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editScore, setEditScore] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCopyClipboard = async () => {
    const success = await copyToClipboardForExcel(grades);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const startEdit = (student: StudentGrade) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditScore(String(student.rawScore));
  };

  const saveEdit = (id: string) => {
    const num = parseFloat(editScore);
    if (!isNaN(num) && num >= 0) {
      onUpdateRawScore(id, num);
    }
    if (editName.trim()) {
      onUpdateName(id, editName.trim());
    }
    setEditingId(null);
  };

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    return grades.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (filterStatus === 'remedial') {
        return !student.passedBefore;
      }
      if (filterStatus === 'passed') {
        return student.passedBefore;
      }
      if (filterStatus === 'boosted') {
        return student.delta > 0;
      }
      return true;
    });
  }, [grades, search, filterStatus]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        const cmp = (aVal as string).localeCompare(bVal as string);
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      if (typeof aVal === 'boolean') {
        aVal = aVal ? 1 : 0;
        bVal = bVal ? 1 : 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  // Paginated rows
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  const remedialCount = grades.filter((g) => !g.passedBefore).length;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-colors space-y-4">
      {/* Top Bar: Title & Export Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t.tableTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.tableSubtitle}
          </p>
        </div>

        {/* Export Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy to Clipboard */}
          <button
            id="btn-copy-clipboard"
            type="button"
            onClick={handleCopyClipboard}
            disabled={grades.length === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              copySuccess
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            title={t.btnCopyExcel}
          >
            {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-indigo-500" />}
            <span>{copySuccess ? t.btnCopied : t.btnCopyExcel}</span>
          </button>

          {/* Export Excel (.xlsx) */}
          <button
            id="btn-export-excel"
            type="button"
            onClick={() => exportToExcel(grades, kkm, methodName)}
            disabled={grades.length === 0}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Download formatted Excel spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.btnExportExcel}</span>
          </button>

          {/* Export CSV */}
          <button
            id="btn-export-csv"
            type="button"
            onClick={() => exportToCSV(grades)}
            disabled={grades.length === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 cursor-pointer"
            title="Download CSV file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.btnExportCSV}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="input-search-students"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            id="filter-status-all"
            type="button"
            onClick={() => {
              setFilterStatus('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.filterAll} ({grades.length})
          </button>
          <button
            id="filter-status-remedial"
            type="button"
            onClick={() => {
              setFilterStatus('remedial');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'remedial'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.filterRemedial} ({remedialCount})
          </button>
          <button
            id="filter-status-passed"
            type="button"
            onClick={() => {
              setFilterStatus('passed');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'passed'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.filterPassed} ({grades.length - remedialCount})
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th
                onClick={() => handleSort('originalIndex')}
                className="py-3 px-3.5 cursor-pointer hover:text-indigo-600 transition w-14"
              >
                <div className="flex items-center gap-1">
                  <span>{t.thNo}</span>
                  {sortField === 'originalIndex' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('name')}
                className="py-3 px-3.5 cursor-pointer hover:text-indigo-600 transition"
              >
                <div className="flex items-center gap-1">
                  <span>{t.thName}</span>
                  {sortField === 'name' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('rawScore')}
                className="py-3 px-3.5 cursor-pointer hover:text-indigo-600 transition text-right w-28"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{t.thRaw}</span>
                  {sortField === 'rawScore' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('scaledScore')}
                className="py-3 px-3.5 cursor-pointer hover:text-indigo-600 transition text-right w-32"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{t.thScaled}</span>
                  {sortField === 'scaledScore' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('delta')}
                className="py-3 px-3.5 cursor-pointer hover:text-indigo-600 transition text-right w-24"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{t.thDelta}</span>
                  {sortField === 'delta' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('passedAfter')}
                className="py-3 px-3.5 cursor-pointer hover:text-indigo-600 transition text-center w-32"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{t.thStatus}</span>
                  {sortField === 'passedAfter' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th className="py-3 px-3.5 text-center w-20">{t.thActions}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  {grades.length === 0 ? 'Belum ada data siswa. Silakan masukkan nilai di atas.' : 'Tidak ada siswa yang cocok dengan filter.'}
                </td>
              </tr>
            ) : (
              paginatedData.map((student) => {
                const isEditing = editingId === student.id;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Index */}
                    <td className="py-2.5 px-3.5 text-slate-500 dark:text-slate-400 font-mono text-xs">
                      {student.originalIndex}
                    </td>

                    {/* Student Name */}
                    <td className="py-2.5 px-3.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(student.id)}
                          className="w-full text-xs sm:text-sm px-2 py-1 rounded-lg border border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => startEdit(student)}
                          className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                          title="Klik untuk ubah nama"
                        >
                          {student.name}
                        </span>
                      )}
                    </td>

                    {/* Raw Score */}
                    <td className="py-2.5 px-3.5 text-right font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          step="any"
                          value={editScore}
                          onChange={(e) => setEditScore(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(student.id)}
                          className="w-20 text-right text-xs sm:text-sm px-2 py-1 rounded-lg border border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      ) : (
                        <span
                          onClick={() => startEdit(student)}
                          className={`cursor-pointer hover:underline ${
                            student.rawScore < kkm
                              ? 'text-rose-600 dark:text-rose-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                          title="Klik untuk ubah nilai asli"
                        >
                          {student.rawScore}
                        </span>
                      )}
                    </td>

                    {/* Scaled Score */}
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                      {student.scaledScore}
                    </td>

                    {/* Delta */}
                    <td className="py-2.5 px-3.5 text-right font-mono text-xs">
                      {student.delta > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          +{student.delta}
                        </span>
                      ) : student.delta < 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          {student.delta}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    {/* Status KKM */}
                    <td className="py-2.5 px-3.5 text-center">
                      {student.passedAfter ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          {t.statusBadgeTuntas}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <AlertCircle className="w-3 h-3" />
                          {t.statusBadgeBelum}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => saveEdit(student.id)}
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                            title="Simpan"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(student)}
                            className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Ubah data"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Hapus siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Footer summary */}
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <div>
            {t.showingPagination
              .replace('{start}', String((currentPage - 1) * pageSize + 1))
              .replace('{end}', String(Math.min(currentPage * pageSize, sortedData.length)))
              .replace('{total}', String(sortedData.length))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
