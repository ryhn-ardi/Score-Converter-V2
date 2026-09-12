import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  ClipboardPaste,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Layers,
  FileUp,
} from 'lucide-react';
import { StudentRawInput } from '../types';
import { parsePastedText, parseUploadedFile } from '../utils/fileParser';
import { Language, translations } from '../utils/translations';

interface DataInputSectionProps {
  onLoadStudents: (newStudents: StudentRawInput[], mode: 'replace' | 'append') => void;
  currentCount: number;
  language: Language;
}

export const DataInputSection: React.FC<DataInputSectionProps> = ({
  onLoadStudents,
  currentCount,
  language,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'quick-add'>('paste');
  const [pastedText, setPastedText] = useState('');
  const [detectedCount, setDetectedCount] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Quick single add state
  const [singleName, setSingleName] = useState('');
  const [singleScore, setSingleScore] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze pasted text in real time
  const handlePastedTextChange = (text: string) => {
    setPastedText(text);
    if (!text.trim()) {
      setDetectedCount(null);
      return;
    }
    const detected = parsePastedText(text);
    setDetectedCount(detected.length);
  };

  const applyPastedData = (mode: 'replace' | 'append') => {
    if (!pastedText.trim()) return;
    const students = parsePastedText(pastedText);
    if (students.length === 0) {
      setUploadError(t.msgNoScoresFound);
      return;
    }
    onLoadStudents(students, mode);
    setPastedText('');
    setDetectedCount(null);
    setUploadError(null);
    setUploadSuccess(t.msgLoadedSuccess.replace('{count}', String(students.length)));
    setTimeout(() => setUploadSuccess(null), 4000);
  };

  const handleFileUpload = async (file: File, mode: 'replace' | 'append' = 'replace') => {
    setIsProcessing(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const students = await parseUploadedFile(file);
      onLoadStudents(students, mode);
      setUploadSuccess(
        t.msgImportSuccess.replace('{count}', String(students.length)).replace('{fileName}', file.name)
      );
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error reading file. Please check format.';
      setUploadError(errorMsg);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], 'replace');
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], 'replace');
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const score = parseFloat(singleScore);
    if (isNaN(score) || score < 0 || score > 1000) return;

    const newStudent: StudentRawInput = {
      id: `manual_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: singleName.trim() || `Siswa ${currentCount + 1}`,
      rawScore: score,
    };

    onLoadStudents([newStudent], 'append');
    setSingleName('');
    setSingleScore('');
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-colors">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardPaste className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t.inputTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.inputSubtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            id="tab-paste-input"
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            {t.tabPaste}
          </button>
          <button
            id="tab-upload-file"
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {t.tabUpload}
          </button>
          <button
            id="tab-quick-add"
            type="button"
            onClick={() => setActiveTab('quick-add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quick-add'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            {t.tabQuickAdd}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {uploadSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {uploadError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* TAB 1: Direct Paste / Textarea */}
      {activeTab === 'paste' && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              id="textarea-grades-input"
              rows={4}
              value={pastedText}
              onChange={(e) => handlePastedTextChange(e.target.value)}
              placeholder={t.textareaPlaceholder}
              className="w-full font-mono text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            />
            {detectedCount !== null && (
              <div className="absolute right-3 bottom-3 text-xs bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {t.detectedStudents.replace('{count}', String(detectedCount))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Info className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{t.autoDetectNotice}</span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                id="btn-append-pasted-data"
                type="button"
                onClick={() => applyPastedData('append')}
                disabled={!pastedText.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1.5"
                title="Add to current student list"
              >
                <Layers className="w-3.5 h-3.5" />
                {t.btnAppend.replace('{count}', String(currentCount))}
              </button>

              <button
                id="btn-replace-pasted-data"
                type="button"
                onClick={() => applyPastedData('replace')}
                disabled={!pastedText.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-indigo-500/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.btnApplyReplace}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={onFileChange}
            className="hidden"
            id="file-upload-input"
          />

          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[0.99]'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/30 dark:bg-slate-800/30'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileUp className="w-6 h-6" />
              )}
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t.dropTitle}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.dropSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Quick Add */}
      {activeTab === 'quick-add' && (
        <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="w-full sm:flex-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.quickNameLabel}
            </label>
            <input
              id="input-quick-student-name"
              type="text"
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              placeholder={`Contoh: Siswa ${currentCount + 1}`}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="w-full sm:w-36">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.quickScoreLabel}
            </label>
            <input
              id="input-quick-student-score"
              type="number"
              min="0"
              max="1000"
              step="any"
              value={singleScore}
              onChange={(e) => setSingleScore(e.target.value)}
              placeholder="Contoh: 58"
              required
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-mono"
            />
          </div>

          <button
            id="btn-submit-quick-add"
            type="submit"
            disabled={!singleScore}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            {t.btnAddStudent}
          </button>
        </form>
      )}
    </section>
  );
};
