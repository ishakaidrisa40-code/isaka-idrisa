import React from 'react';
import { Bookmark, BookOpen, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import { FormLevel, SubjectBook, SubjectId } from '../types/curriculum';
import { SUBJECT_METAS } from '../data/curriculumData';
import { useApp } from '../context/AppContext';

interface BookCoverProps {
  book: SubjectBook;
  size?: 'sm' | 'md' | 'lg';
  showActions?: boolean;
}

export const BookCover: React.FC<BookCoverProps> = ({ book, size = 'md', showActions = true }) => {
  const { openBook, toggleBookmark, isBookmarked, userProgress } = useApp();
  const meta = SUBJECT_METAS[book.subjectId] || SUBJECT_METAS.mathematics;
  const bookmarked = isBookmarked(book.title);

  // Check how many chapters completed
  const completedInBook = book.chapters.filter((ch) =>
    userProgress.completedTopicIds.includes(ch.id)
  ).length;

  const sizeClasses = {
    sm: 'w-40 h-56 text-xs',
    md: 'w-56 h-80 text-sm',
    lg: 'w-64 h-92 text-base',
  }[size];

  const handleOpen = () => {
    openBook(book.form, book.subjectId);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark({
      type: 'topic',
      form: book.form,
      subjectId: book.subjectId,
      subjectName: meta.name,
      title: book.title,
      subtitle: `${book.form} • ${book.totalChapters} Chapters`,
      linkPath: {
        view: 'book',
        form: book.form,
        subjectId: book.subjectId,
      },
    });
  };

  return (
    <div className="group relative flex flex-col items-center">
      {/* 3D Realistic Book Perspective Container */}
      <div
        onClick={handleOpen}
        className={`relative ${sizeClasses} cursor-pointer rounded-r-xl rounded-l-md transition-all duration-300 ease-out 
          hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-950/20 active:translate-y-0
          shadow-lg shadow-slate-900/10 dark:shadow-black/50 select-none overflow-hidden`}
        style={{
          perspective: '1000px',
        }}
      >
        {/* Book Spine Texture and Embossed Left Edge */}
        <div className="absolute left-0 top-0 bottom-0 w-3 sm:w-4 bg-gradient-to-r from-black/50 via-white/20 to-black/30 z-20 pointer-events-none" />
        <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-black/30 z-20 pointer-events-none" />

        {/* Paper Edge Layer simulation on the right edge */}
        <div className="absolute right-0 top-1 bottom-1 w-1 bg-gradient-to-l from-amber-100 to-amber-50 dark:from-slate-700 dark:to-slate-800 z-10 border-l border-amber-300/40" />

        {/* Cover Background with dynamic subject gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${meta.color} p-4 sm:p-5 flex flex-col justify-between text-white overflow-hidden`}
        >
          {/* Subtle Tanzanian geometric textile pattern overlay */}
          <div
            className="absolute inset-0 opacity-10 bg-repeat pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.7) 1px, transparent 0)`,
              backgroundSize: '16px 16px',
            }}
          />

          {/* Tanzanian Flag Decorative Ribbon Accent on Top Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
            <div className="absolute transform rotate-45 bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-600 text-center text-[8px] font-bold py-0.5 right-[-35px] top-[18px] w-[120px] shadow-sm text-black">
              TZ SYLLABUS
            </div>
          </div>

          {/* Book Header: Level & National Curriculum Stamp */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/20 backdrop-blur-sm tracking-wider uppercase border border-white/30 text-amber-200">
                {book.form}
              </span>

              {/* Bookmark quick button */}
              <button
                type="button"
                onClick={handleBookmarkClick}
                className={`p-1.5 rounded-full transition-transform hover:scale-110 active:scale-95 ${
                  bookmarked
                    ? 'bg-amber-400 text-slate-900 shadow-md'
                    : 'bg-black/30 text-white/80 hover:bg-black/50 hover:text-white'
                }`}
                title={bookmarked ? 'Remove bookmark' : 'Bookmark this textbook'}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Official Tanzanian TIE Seal */}
            <div className="mt-2.5 flex items-center gap-1.5 opacity-90">
              <div className="w-4 h-4 rounded-full border border-amber-300/80 flex items-center justify-center text-[7px] font-extrabold text-amber-300">
                TZ
              </div>
              <span className="text-[9px] uppercase tracking-wider text-amber-100/90 font-medium">
                National Curriculum
              </span>
            </div>
          </div>

          {/* Book Center: Subject Title & Swahili Name */}
          <div className="relative z-10 my-auto text-center py-2">
            <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl leading-tight text-white drop-shadow-md">
              {meta.name}
            </h3>
            <p className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-medium italic">
              {meta.swahiliName}
            </p>

            <div className="mt-3 mx-auto w-12 h-0.5 bg-amber-400/80 rounded-full" />

            <p className="mt-2 text-[10px] text-white/80 line-clamp-2 px-1 font-sans">
              {meta.shortDesc}
            </p>
          </div>

          {/* Book Footer: Edition, Chapters & Completion Badge */}
          <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between text-[10px] text-white/90">
            <div>
              <span className="block font-semibold">{book.totalChapters} Chapters</span>
              <span className="text-[8px] opacity-75">TIE / NECTA Format</span>
            </div>

            {completedInBook > 0 ? (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/80 text-white text-[9px] font-semibold">
                <CheckCircle className="w-3 h-3" />
                {completedInBook}/{book.totalChapters}
              </div>
            ) : (
              <span className="text-[9px] text-amber-200 opacity-90 font-mono">
                {book.form.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Optional action buttons under book */}
      {showActions && (
        <div className="mt-3 flex items-center gap-1.5 w-full max-w-[220px]">
          <button
            onClick={handleOpen}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Book</span>
          </button>
        </div>
      )}
    </div>
  );
};
