import React, { useState } from 'react';
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  List,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExerciseItem, QuizQuestion, TopicSection } from '../types/curriculum';
import { SUBJECT_METAS } from '../data/curriculumData';
import { ReaderTab, useApp } from '../context/AppContext';

export const BookReaderView: React.FC = () => {
  const {
    currentBook,
    activeChapterIndex,
    setActiveChapterIndex,
    activeReaderTab,
    setActiveReaderTab,
    setCurrentView,
    toggleBookmark,
    isBookmarked,
    recordQuizScore,
    markTopicCompleted,
    askAiAboutTopic,
  } = useApp();

  const [inBookSearch, setInBookSearch] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [readingFont, setReadingFont] = useState<'serif' | 'sans'>('serif');
  const [quizDifficultyFilter, setQuizDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  if (!currentBook) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No textbook selected.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const meta = SUBJECT_METAS[currentBook.subjectId] || SUBJECT_METAS.mathematics;
  const currentChapter: TopicSection =
    currentBook.chapters[activeChapterIndex] || currentBook.chapters[0];
  const bookmarked = isBookmarked(currentChapter.title);

  // Chapter navigation
  const hasPrev = activeChapterIndex > 0;
  const hasNext = activeChapterIndex < currentBook.chapters.length - 1;

  const goToChapter = (idx: number) => {
    setActiveChapterIndex(idx);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setRevealedSolutions({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextChapter = () => {
    if (hasNext) goToChapter(activeChapterIndex + 1);
  };

  const handlePrevChapter = () => {
    if (hasPrev) goToChapter(activeChapterIndex - 1);
  };

  // Bookmark toggle
  const handleBookmark = () => {
    toggleBookmark({
      type: 'topic',
      form: currentBook.form,
      subjectId: currentBook.subjectId,
      subjectName: meta.name,
      title: currentChapter.title,
      subtitle: `${currentBook.form} ${meta.name} • ${currentChapter.subtopics.join(', ')}`,
      linkPath: {
        view: 'book',
        form: currentBook.form,
        subjectId: currentBook.subjectId,
        topicId: currentChapter.id,
      },
    });
  };

  // Quiz methods
  const filteredQuizQuestions = currentChapter.quiz.filter(
    (q) => quizDifficultyFilter === 'All' || q.difficulty === quizDifficultyFilter
  );

  const handleOptionSelect = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    filteredQuizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const score = calculateScore();
    const total = filteredQuizQuestions.length;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    recordQuizScore({
      bookId: currentBook.id,
      subjectId: currentBook.subjectId,
      form: currentBook.form,
      topicTitle: currentChapter.title,
      score,
      total,
      percentage,
    });

    if (percentage >= 70) {
      markTopicCompleted(currentChapter.id, currentChapter.title);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleQuizRetry = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  // Solution and Hint toggle
  const toggleSolution = (exId: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  const toggleHint = (exId: string) => {
    setRevealedHints((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Navigation Bar inside Book */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('form-subjects')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Back to subject books"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {currentBook.form} • {meta.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                {currentBook.curriculumCode}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white">
              {currentChapter.title}
            </h1>
          </div>
        </div>

        {/* Action Controls: Chapter Switcher, Bookmark, Ask AI, Font Toggle */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Chapter Selector Dropdown */}
          <select
            value={activeChapterIndex}
            onChange={(e) => goToChapter(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            {currentBook.chapters.map((ch, i) => (
              <option key={ch.id} value={i}>
                {ch.title}
              </option>
            ))}
          </select>

          {/* Ask AI about this chapter */}
          <button
            onClick={() => askAiAboutTopic(currentBook.form, currentBook.subjectId, currentChapter.title)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-800 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1.5 transition-colors"
            title="Ask AI Study Tutor about this chapter"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ask AI Tutor</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              bookmarked
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
            title={bookmarked ? 'Chapter bookmarked' : 'Bookmark this chapter'}
          >
            <BookMarked className="w-4 h-4" />
            <span className="hidden sm:inline">{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          {/* Font switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setReadingFont('serif')}
              className={`px-2 py-1 rounded-lg font-serif font-bold ${
                readingFont === 'serif' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              Serif
            </button>
            <button
              onClick={() => setReadingFont('sans')}
              className={`px-2 py-1 rounded-lg font-sans font-bold ${
                readingFont === 'sans' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              Sans
            </button>
          </div>
        </div>
      </div>

      {/* Book Inner Navigation Tabs (TOC, Notes, Examples, Exercises, Revision, Quiz) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 gap-1">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'toc', label: 'Table of Contents', icon: List },
            { id: 'notes', label: 'Notes', icon: BookOpen },
            { id: 'examples', label: 'Worked Examples', icon: Lightbulb },
            { id: 'exercises', label: 'Exercises', icon: HelpCircle },
            { id: 'revision', label: 'Revision & Past Papers', icon: CheckCircle },
            { id: 'quiz', label: 'Interactive Quiz', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeReaderTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReaderTab(tab.id as ReaderTab)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick In-Book Search Input */}
        <div className="relative min-w-[180px] hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search in chapter..."
            value={inBookSearch}
            onChange={(e) => setInBookSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Textbook Page Content Container */}
      <div
        className={`rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm
          ${readingFont === 'serif' ? 'font-serif' : 'font-sans'} 
          ${fontSize === 'large' ? 'text-lg leading-relaxed' : 'text-base leading-relaxed'}`}
      >
        {/* --- TAB 1: TABLE OF CONTENTS --- */}
        {activeReaderTab === 'toc' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {currentBook.title} — Table of Contents
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tanzania Institute of Education (TIE) Syllabus • {currentBook.totalChapters} Chapters
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentBook.chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    goToChapter(idx);
                    setActiveReaderTab('notes');
                  }}
                  className={`py-4 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    idx === activeChapterIndex
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        Ch. {idx + 1}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base">{ch.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                      {ch.subtopics.join(' • ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {ch.exercises.length} Exercises • {ch.quiz.length} Quizzes
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: DETAILED NOTES --- */}
        {activeReaderTab === 'notes' && (
          <div className="space-y-8">
            {/* Chapter Header Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/40">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                {currentBook.form} Syllabus • {meta.name}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentChapter.title}
              </h2>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentChapter.overview}
              </p>

              {/* Subtopic badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {currentChapter.subtopics.map((st, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-xs border border-emerald-200 dark:border-emerald-800"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* Structured Textbook Notes Section */}
            <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-serif text-emerald-800 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-800 pb-2">
                  1. Comprehensive Theoretical Foundations
                </h3>
                <p>
                  In the Tanzanian secondary curriculum established by the <strong>Tanzania Institute of Education (TIE)</strong>,
                  mastery of <em>{currentChapter.title}</em> begins with establishing fundamental definitions and principles.
                  In accordance with the <strong>NECTA</strong> syllabus criteria, students must understand both qualitative
                  explanations and rigorous quantitative formulations.
                </p>

                {currentChapter.subtopics.map((st, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-sans font-bold">
                        {i + 1}
                      </span>
                      <span>Topic Area: {st}</span>
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      The core scientific or academic law governing <strong>{st}</strong> requires students to analyze:
                    </p>
                    <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
                      <li>The precise definition according to NECTA exam format.</li>
                      <li>Standard SI units and dimensional quantities where applicable.</li>
                      <li>Relationship with everyday Tanzanian socio-economic and technological applications.</li>
                      <li>Key examination pitfalls and common derivation mistakes.</li>
                    </ul>
                  </div>
                ))}
              </div>

              {/* Tanzanian Context Exam Tip Callout */}
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-amber-900 dark:text-amber-200 space-y-2">
                <div className="font-bold flex items-center gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>NECTA Examination Guidance & Marking Standards</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  In national examination papers (FTNA for Form 2, CSEE for Form 4, ACSEE for Form 6), candidates
                  are evaluated on precision. For calculation questions, full marks are awarded when you:
                  <br />
                  1. Write down the primary formula.
                  <br />
                  2. List the given parameters with their proper units.
                  <br />
                  3. Show full step-by-step substitution.
                  <br />
                  4. State the final numerical answer clearly underlined with its correct SI unit.
                </p>
              </div>
            </div>

            {/* Quick action buttons at bottom of notes */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveReaderTab('examples')}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm"
              >
                <span>Continue to Worked Examples</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => askAiAboutTopic(currentBook.form, currentBook.subjectId, currentChapter.title)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI to Explain Concept</span>
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 3: WORKED EXAMPLES --- */}
        {activeReaderTab === 'examples' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Worked Examples: {currentChapter.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Step-by-step model answers structured according to NECTA marking schemes.
              </p>
            </div>

            <div className="space-y-6">
              {currentChapter.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      Worked Example {idx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">TIE Method</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{ex.title}</h3>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                      Problem Statement:
                    </span>
                    {ex.problem}
                  </div>

                  {ex.givenData && ex.givenData.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Given Information:
                      </span>
                      <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                        {ex.givenData.map((gd, gi) => (
                          <li key={gi}>{gd}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Step-by-Step Solution:
                    </span>
                    <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500">
                      {ex.steps.map((st, si) => (
                        <div key={si} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                          {st}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-bold flex items-center justify-between">
                    <span>{ex.finalAnswer}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                    <strong>Key Exam Rule:</strong> {ex.keyTakeaway}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveReaderTab('exercises')}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
              >
                <span>Test Yourself in Exercises</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 4: EXERCISES --- */}
        {activeReaderTab === 'exercises' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Chapter Exercises: {currentChapter.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Solve these questions on paper, then check the hints and verified marking scheme solutions.
              </p>
            </div>

            <div className="space-y-6">
              {currentChapter.exercises.map((ex, idx) => {
                const isSolRevealed = revealedSolutions[ex.id];
                const isHintRevealed = revealedHints[ex.id];

                return (
                  <div
                    key={ex.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        Exercise {idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ex.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : ex.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {ex.difficulty}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                      {ex.question}
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => toggleHint(ex.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-1.5"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{isHintRevealed ? 'Hide Hint' : 'Show Hint'}</span>
                      </button>

                      <button
                        onClick={() => toggleSolution(ex.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 transition-colors flex items-center gap-1.5"
                      >
                        {isSolRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isSolRevealed ? 'Hide Solution' : 'View Full Solution'}</span>
                      </button>
                    </div>

                    {isHintRevealed && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                        <strong>Hint:</strong> {ex.hint}
                      </div>
                    )}

                    {isSolRevealed && (
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2 animate-in fade-in">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>NECTA Marking Scheme Solution:</span>
                        </div>
                        <div className="whitespace-pre-line leading-relaxed font-mono text-xs">
                          {ex.solution}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TAB 5: REVISION & PAST PAPERS --- */}
        {activeReaderTab === 'revision' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Revision & NECTA Past-Paper Questions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Summary takeaways and actual examination style questions from national papers.
              </p>
            </div>

            {/* Quick Revision Bullets */}
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Chapter Summary Takeaways</span>
              </h3>
              <ul className="space-y-2">
                {currentChapter.revisionSummary.map((rev, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span>{rev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Past Paper Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                NECTA Style Past Examination Questions
              </h3>

              {currentChapter.pastPaperQuestions.map((ppq, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold text-xs">
                      {ppq.yearRef}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      [{ppq.marks} Marks]
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white whitespace-pre-line">
                    {ppq.question}
                  </p>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Marking Criteria & Model Answer:
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {ppq.sampleAnswer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 6: INTERACTIVE QUIZZES --- */}
        {activeReaderTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                  Chapter Quiz: {currentChapter.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Test your mastery of this chapter. Instant scores and NECTA explanations.
                </p>
              </div>

              {/* Quiz difficulty filter */}
              <div className="flex items-center gap-1.5">
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setQuizDifficultyFilter(diff)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      quizDifficultyFilter === diff
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz Result Score Card if submitted */}
            {quizSubmitted && (
              <div
                className={`p-6 rounded-2xl border text-center space-y-3 animate-in zoom-in-95 ${
                  (calculateScore() / filteredQuizQuestions.length) >= 0.7
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-white dark:bg-slate-800 shadow-md">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold font-serif">
                  {(calculateScore() / filteredQuizQuestions.length) >= 0.7
                    ? 'Hongera! Excellent Performance!'
                    : 'Good Effort! Keep Practicing!'}
                </h3>
                <p className="text-sm">
                  You scored <strong className="text-base">{calculateScore()}</strong> out of{' '}
                  <strong className="text-base">{filteredQuizQuestions.length}</strong> (
                  {Math.round((calculateScore() / filteredQuizQuestions.length) * 100)}%)
                </p>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleQuizRetry}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>

                  {hasNext && (
                    <button
                      onClick={handleNextChapter}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2"
                    >
                      <span>Next Chapter</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
              {filteredQuizQuestions.map((q, qIndex) => {
                const isSelected = selectedAnswers[q.id] !== undefined;
                const selectedOpt = selectedAnswers[q.id];
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        Question {qIndex + 1}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {q.nectaYearRef || 'NECTA Standard'} • {q.difficulty}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                      {q.question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIndex) => {
                        let optStyle =
                          'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

                        if (quizSubmitted) {
                          if (optIndex === q.correctIndex) {
                            optStyle =
                              'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (selectedOpt === optIndex) {
                            optStyle =
                              'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200';
                          }
                        } else if (selectedOpt === optIndex) {
                          optStyle =
                            'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold';
                        }

                        return (
                          <div
                            key={optIndex}
                            onClick={() => handleOptionSelect(q.id, optIndex)}
                            className={`p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between ${optStyle}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            {quizSubmitted && optIndex === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {quizSubmitted && selectedOpt === optIndex && optIndex !== q.correctIndex && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation after submit */}
                    {quizSubmitted && (
                      <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">
                          TIE Marking Explanation:
                        </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit button */}
            {!quizSubmitted && filteredQuizQuestions.length > 0 && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={handleQuizSubmit}
                  className="px-8 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Submit Quiz Answers
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chapter Next / Previous Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handlePrevChapter}
          disabled={!hasPrev}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            hasPrev
              ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
              : 'opacity-40 cursor-not-allowed text-slate-400'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Chapter</span>
        </button>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Chapter {activeChapterIndex + 1} of {currentBook.chapters.length}
        </span>

        <button
          onClick={handleNextChapter}
          disabled={!hasNext}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            hasNext
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              : 'opacity-40 cursor-not-allowed text-slate-400'
          }`}
        >
          <span>Next Chapter</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
