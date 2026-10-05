import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Search as SearchIcon,
  Sparkles,
} from 'lucide-react';
import { FormLevel, SubjectBook, SubjectId } from '../types/curriculum';
import { FORMS, getAllBooksForForm, SUBJECT_METAS } from '../data/curriculumData';
import { SCIENCE_PRACTICALS } from '../data/practicalsData';
import { useApp } from '../context/AppContext';

export const GlobalSearchView: React.FC = () => {
  const { searchQuery, setSearchQuery, openBook, openPractical, setCurrentView, askAiAboutTopic } =
    useApp();
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  // Flatten curriculum across all forms and subjects for lightning fast search
  const allCurriculumItems = useMemo(() => {
    const list: {
      type: 'topic' | 'book' | 'practical';
      title: string;
      form: FormLevel;
      subjectId: SubjectId | 'practical';
      subjectName: string;
      subtitle: string;
      chapterIdx?: number;
      practicalId?: string;
      keywords: string;
    }[] = [];

    // Add books & topics
    FORMS.forEach((form) => {
      const books = getAllBooksForForm(form);
      books.forEach((b) => {
        const meta = SUBJECT_METAS[b.subjectId];
        list.push({
          type: 'book',
          title: b.title,
          form: b.form,
          subjectId: b.subjectId,
          subjectName: meta.name,
          subtitle: `${b.totalChapters} chapters • ${meta.swahiliName}`,
          keywords: `${b.form} ${meta.name} ${meta.swahiliName} textbook syllabus`.toLowerCase(),
        });

        b.chapters.forEach((ch, idx) => {
          list.push({
            type: 'topic',
            title: ch.title,
            form: b.form,
            subjectId: b.subjectId,
            subjectName: meta.name,
            subtitle: `${b.form} ${meta.name} • ${ch.subtopics.join(', ')}`,
            chapterIdx: idx,
            keywords: `${b.form} ${meta.name} ${ch.title} ${ch.subtopics.join(' ')} ${ch.overview}`.toLowerCase(),
          });
        });
      });
    });

    // Add practicals
    SCIENCE_PRACTICALS.forEach((p) => {
      list.push({
        type: 'practical',
        title: p.title,
        form: p.form,
        subjectId: 'practical',
        subjectName: `${p.subject} Practical`,
        subtitle: `${p.form} • ${p.aim}`,
        practicalId: p.id,
        keywords: `${p.form} ${p.subject} practical experiment lab ${p.title} ${p.aim} ${p.apparatus.join(' ')}`.toLowerCase(),
      });
    });

    return list;
  }, []);

  const queryTerms = localQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const searchResults = useMemo(() => {
    if (queryTerms.length === 0) return [];
    return allCurriculumItems.filter((item) =>
      queryTerms.every((term) => item.keywords.includes(term) || item.title.toLowerCase().includes(term))
    );
  }, [allCurriculumItems, queryTerms]);

  const quickSearches = [
    "Newton's laws",
    'Form 3 Chemistry',
    'Photosynthesis',
    'Quadratic equations',
    'Form 2 Physics',
    'Maji Maji',
    'Titration',
    'Volumetric Analysis',
    'Coordinate Geometry',
  ];

  const handleSelectQuickSearch = (term: string) => {
    setLocalQuery(term);
    setSearchQuery(term);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="space-y-3">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Library Home</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
          Curriculum Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Instantly find any topic, textbook, past-paper question, or science practical across all Forms.
        </p>

        {/* Search Bar Input */}
        <div className="relative mt-2">
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder='Try searching "Newton’s laws", "Form 3 Chemistry", "Photosynthesis", or "Quadratic equations"...'
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Suggested Quick Search Terms */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Popular Tanzanian Curriculum Searches:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {quickSearches.map((term, i) => (
            <button
              key={i}
              onClick={() => handleSelectQuickSearch(term)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-slate-700 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>Search Results ({searchResults.length})</span>
          {localQuery && <span>Keywords: "{localQuery}"</span>}
        </div>

        {queryTerms.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <SearchIcon className="w-8 h-8 mx-auto text-slate-400" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Start typing to search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Search by subject, Form level (e.g. Form 1, Form 4), specific topic name, or science experiment.
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No direct matches found for "{localQuery}".
            </p>
            <p className="text-xs text-slate-500">
              You can ask the AI Study Assistant to explain "{localQuery}" specifically for your Form level!
            </p>
            <button
              onClick={() => askAiAboutTopic('Form 3', 'physics', localQuery)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 inline-flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Tutor about "{localQuery}"</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.type === 'practical' && item.practicalId) {
                    openPractical(item.practicalId);
                  } else if (item.subjectId !== 'practical') {
                    openBook(item.form, item.subjectId as SubjectId, item.chapterIdx ?? 0);
                  }
                }}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-md flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.type === 'practical'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {item.type === 'practical' ? 'Science Practical' : 'Curriculum Topic'}
                    </span>

                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {item.form} • {item.subjectName}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform">
                  <span className="hidden sm:inline">Open Learning Material</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
