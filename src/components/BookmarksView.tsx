import React, { useState } from 'react';
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookmarksView: React.FC = () => {
  const { bookmarks, toggleBookmark, openBook, openPractical, setCurrentView } = useApp();
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = bookmarks.filter((b) => {
    if (filterType === 'All') return true;
    return b.type === filterType.toLowerCase();
  });

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
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
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <BookMarked className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            My Bookmarks
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Saved chapters, formulas, examination notes, and laboratory practical manuals.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5">
        {['All', 'Topic', 'Practical'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === type
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {type}s
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <BookMarked className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300">No bookmarks saved yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon inside any textbook chapter or practical manual to keep your favorite revision notes here.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
          >
            Browse Secondary Textbooks
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all flex items-center justify-between gap-4 group"
            >
              <div
                onClick={() => {
                  if (item.type === 'practical' && item.linkPath.practicalId) {
                    openPractical(item.linkPath.practicalId);
                  } else if (item.linkPath.form && item.linkPath.subjectId) {
                    openBook(item.linkPath.form, item.linkPath.subjectId);
                  }
                }}
                className="cursor-pointer space-y-1 flex-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.type === 'practical'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {item.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {item.form} • {item.subjectName}
                  </span>
                  <span className="text-[10px] text-slate-400">Saved: {item.savedAt}</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    toggleBookmark({
                      type: item.type,
                      form: item.form,
                      subjectId: item.subjectId,
                      subjectName: item.subjectName,
                      title: item.title,
                      subtitle: item.subtitle,
                      linkPath: item.linkPath,
                    })
                  }
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div
                  onClick={() => {
                    if (item.type === 'practical' && item.linkPath.practicalId) {
                      openPractical(item.linkPath.practicalId);
                    } else if (item.linkPath.form && item.linkPath.subjectId) {
                      openBook(item.linkPath.form, item.linkPath.subjectId);
                    }
                  }}
                  className="cursor-pointer p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
