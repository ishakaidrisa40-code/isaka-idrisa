import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  GraduationCap,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { FormLevel, SubjectId } from '../types/curriculum';
import { FORMS, getSubjectBook, SUBJECT_METAS } from '../data/curriculumData';
import { useApp } from '../context/AppContext';

export const QuizzesView: React.FC = () => {
  const { openBook, userProgress, setCurrentView, selectedForm, setSelectedForm } = useApp();
  const [activeForm, setActiveForm] = useState<FormLevel>(selectedForm || 'Form 1');
  const [activeSubject, setActiveSubject] = useState<SubjectId>('mathematics');

  const book = getSubjectBook(activeForm, activeSubject);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Library Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            Curriculum Quizzes & Mock Assessments
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Practice NECTA format multiple-choice and conceptual questions with instant feedback and score tracking.
        </p>
      </div>

      {/* Form Level Selector Pills */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Step 1: Select Education Level
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FORMS.map((form) => (
            <button
              key={form}
              onClick={() => setActiveForm(form)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeForm === form
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Selector Pills */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Step 2: Select Subject
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Object.values(SUBJECT_METAS).map((meta) => (
            <button
              key={meta.id}
              onClick={() => setActiveSubject(meta.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeSubject === meta.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {meta.name}
            </button>
          ))}
        </div>
      </div>

      {/* Available Chapter Quizzes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
            {activeForm} {SUBJECT_METAS[activeSubject].name} Quizzes
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {book.chapters.length} Quizzes Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {book.chapters.map((ch, idx) => {
            // Find past quiz attempt for this topic
            const pastAttempt = userProgress.quizAttempts.find((a) => a.topicTitle === ch.title);

            return (
              <div
                key={ch.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Chapter {idx + 1}
                    </span>

                    {pastAttempt && (
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Best: {Math.round(pastAttempt.percentage)}%</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{ch.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {ch.overview}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {ch.quiz.length} Questions (Easy, Medium, Hard)
                  </span>

                  <button
                    onClick={() => openBook(activeForm, activeSubject, idx, 'quiz')}
                    className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Quiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
