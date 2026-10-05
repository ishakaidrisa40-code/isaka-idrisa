import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookMarked,
  CheckCircle,
  Compass,
  FileCheck,
  FileText,
  FlaskConical,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Table as TableIcon,
} from 'lucide-react';
import { FormLevel, SciencePractical } from '../types/curriculum';
import { SCIENCE_PRACTICALS } from '../data/practicalsData';
import { useApp } from '../context/AppContext';

export const PracticalsView: React.FC = () => {
  const { selectedPractical, setSelectedPractical, setCurrentView, toggleBookmark, isBookmarked, askAiAboutTopic } = useApp();

  const [subjectFilter, setSubjectFilter] = useState<'All' | 'Physics' | 'Chemistry' | 'Biology'>('All');
  const [formFilter, setFormFilter] = useState<string>('All');

  const filteredPracticals = SCIENCE_PRACTICALS.filter((p) => {
    if (subjectFilter !== 'All' && p.subject !== subjectFilter) return false;
    if (formFilter !== 'All' && p.form !== formFilter) return false;
    return true;
  });

  const activePractical: SciencePractical =
    selectedPractical || filteredPracticals[0] || SCIENCE_PRACTICALS[0];

  const bookmarked = isBookmarked(activePractical.title);

  const handleBookmark = () => {
    toggleBookmark({
      type: 'practical',
      form: activePractical.form,
      subjectId: 'practical',
      subjectName: `${activePractical.subject} Practical`,
      title: activePractical.title,
      subtitle: `${activePractical.form} • ${activePractical.aim}`,
      linkPath: {
        view: 'practicals',
        practicalId: activePractical.id,
      },
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Library Home</span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              Science Practicals Laboratory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Lab Manuals
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Official secondary laboratory instructions and NECTA practical examination protocols for Physics, Chemistry, and Biology.
          </p>
        </div>

        {/* Filter bars */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {(['All', 'Physics', 'Chemistry', 'Biology'] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  subjectFilter === sub
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Menu of Practicals, Right Detailed Lab Manual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: List of practicals */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Available Practical Manuals ({filteredPracticals.length})
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredPracticals.map((prac) => {
              const isSelected = activePractical.id === prac.id;
              return (
                <div
                  key={prac.id}
                  onClick={() => setSelectedPractical(prac)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        prac.subject === 'Physics'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : prac.subject === 'Chemistry'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                      }`}
                    >
                      {prac.subject}
                    </span>

                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {prac.form}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold leading-snug line-clamp-2 ${
                      isSelected
                        ? 'text-emerald-900 dark:text-emerald-200'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {prac.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {prac.aim}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Full Detailed Science Practical Manual */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8">
            {/* Top practical metadata & title */}
            <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      activePractical.subject === 'Physics'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : activePractical.subject === 'Chemistry'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                    }`}
                  >
                    {activePractical.subject} Practical
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {activePractical.form}
                  </span>
                  <span className="text-xs font-mono text-slate-400">NECTA CSEE/ACSEE Protocol</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      bookmarked
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <BookMarked className="w-4 h-4" />
                    <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>

                  <button
                    onClick={() =>
                      askAiAboutTopic(
                        activePractical.form,
                        activePractical.subject.toLowerCase() as any,
                        activePractical.title,
                        `Can you explain the practical procedure and calculation formulas for "${activePractical.title}" according to NECTA exam requirements?`
                      )
                    }
                    className="p-2 px-3 rounded-xl text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-800 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ask AI Lab Tutor</span>
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-slate-900 dark:text-white">
                {activePractical.title}
              </h2>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 text-sm font-medium">
                <strong className="block text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                  Aim of the Experiment:
                </strong>
                {activePractical.aim}
              </div>
            </div>

            {/* Safety Rules Callout */}
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Laboratory Safety Precautions & Ethical Guidelines:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                {activePractical.safetyRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Apparatus & Materials */}
            <div className="space-y-3">
              <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span>Apparatus and Materials Required</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                {activePractical.apparatus.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedure */}
            <div className="space-y-3">
              <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Experimental Procedure</span>
              </h3>

              <ol className="space-y-3 pl-2">
                {activePractical.procedure.map((step, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Expected Observations */}
            <div className="space-y-2 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600" />
                <span>Expected Experimental Observations</span>
              </h3>
              <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 whitespace-pre-line leading-relaxed">
                {activePractical.expectedObservations}
              </p>
            </div>

            {/* Sample Observation Table if provided */}
            {activePractical.sampleDataTable && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-emerald-600" />
                  <span>Sample Data Table (NECTA Standard Format)</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <tr>
                        {activePractical.sampleDataTable.headers.map((h, i) => (
                          <th key={i} className="p-3 border-b border-slate-200 dark:border-slate-700 font-bold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {activePractical.sampleDataTable.rows.map((row, ri) => (
                        <tr key={ri} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          {row.map((cell, ci) => (
                            <td key={ci} className="p-3 text-slate-800 dark:text-slate-200 font-mono">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Results & Mathematical Formulas */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Governing Equations & Calculations
              </h3>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 whitespace-pre-line leading-relaxed">
                {activePractical.resultsFormula}
              </div>
            </div>

            {/* Conclusion */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Experimental Conclusion
              </h3>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 font-medium">
                {activePractical.conclusion}
              </div>
            </div>

            {/* Discussion Questions */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Post-Practical Discussion & Past Exam Questions</span>
              </h3>

              <div className="space-y-3">
                {activePractical.discussionQuestions.map((dq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Q{idx + 1}: {dq.q}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-emerald-500">
                      <strong>Answer:</strong> {dq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* NECTA Exam Tip */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">NECTA Examiner Practical Tip:</strong>
                {activePractical.nectaExamTip}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
