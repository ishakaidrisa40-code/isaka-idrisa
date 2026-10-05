import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Filter,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { FormLevel, SubjectBook, SubjectId } from '../types/curriculum';
import { FORMS, getAllBooksForForm, SUBJECT_METAS } from '../data/curriculumData';
import { useApp } from '../context/AppContext';
import { BookCover } from './BookCover';

export const FormSubjectsView: React.FC = () => {
  const { selectedForm, openForm, setCurrentView, openBook, askAiAboutTopic } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const books: SubjectBook[] = getAllBooksForForm(selectedForm);

  const categories = ['All', 'Science', 'Languages', 'Arts & Humanities', 'Religious Studies'];

  const filteredBooks = books.filter((book) => {
    if (categoryFilter === 'All') return true;
    const meta = SUBJECT_METAS[book.subjectId];
    return meta.category === categoryFilter;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Forms Shelf</span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              {selectedForm} Curriculum Textbooks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              10 Subjects
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Tanzania Institute of Education (TIE) approved syllabus textbooks for {selectedForm}.
          </p>
        </div>

        {/* Quick Form Switcher Pill Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
          {FORMS.map((form) => (
            <button
              key={form}
              onClick={() => openForm(form)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedForm === form
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing {filteredBooks.length} of 10 textbooks
        </div>
      </div>

      {/* 10 Realistic Subject Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
        {filteredBooks.map((book) => (
          <div key={book.id} className="flex flex-col items-center">
            <BookCover book={book} size="md" showActions={true} />
          </div>
        ))}
      </div>

      {/* Helpful banner: Ask AI about this form */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Study Assistant Ready for {selectedForm}</span>
          </div>
          <h4 className="text-lg font-bold">Have a specific question about {selectedForm}?</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Ask for step-by-step problem solutions or upload a photo of a textbook question.
          </p>
        </div>

        <button
          onClick={() => askAiAboutTopic(selectedForm, 'mathematics', 'General Topics')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask {selectedForm} Tutor</span>
        </button>
      </div>
    </div>
  );
};
