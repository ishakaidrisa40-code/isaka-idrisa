import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeShelf } from './components/HomeShelf';
import { FormSubjectsView } from './components/FormSubjectsView';
import { BookReaderView } from './components/BookReaderView';
import { PracticalsView } from './components/PracticalsView';
import { AiAssistantView } from './components/AiAssistantView';
import { GlobalSearchView } from './components/GlobalSearchView';
import { QuizzesView } from './components/QuizzesView';
import { StudentProgressView } from './components/StudentProgressView';
import { BookmarksView } from './components/BookmarksView';
import { BookOpen, FlaskConical, GraduationCap, Heart, Sparkles } from 'lucide-react';
import { FORMS } from './data/curriculumData';

const MainContent: React.FC = () => {
  const { currentView, openForm, setCurrentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentView === 'home' && <HomeShelf />}
        {currentView === 'form-subjects' && <FormSubjectsView />}
        {currentView === 'book-reader' && <BookReaderView />}
        {currentView === 'practicals' && <PracticalsView />}
        {currentView === 'ai-assistant' && <AiAssistantView />}
        {currentView === 'search' && <GlobalSearchView />}
        {currentView === 'quizzes' && <QuizzesView />}
        {currentView === 'progress' && <StudentProgressView />}
        {currentView === 'bookmarks' && <BookmarksView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md mt-16 text-xs text-slate-500 dark:text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white text-base">
                  STUDY HUB <span className="text-emerald-600 dark:text-emerald-400">AI</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                Tanzanian Digital Learning Library. Providing complete secondary textbooks, science practical manuals, and AI-powered step-by-step tutoring.
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 italic">
                “Elimu ni Ufunguo wa Maisha • Education is the Key to Life”
              </div>
            </div>

            {/* Quick Education Levels */}
            <div>
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
                Education Levels
              </div>
              <ul className="space-y-1.5 text-xs">
                {FORMS.map((form) => (
                  <li key={form}>
                    <button
                      onClick={() => openForm(form)}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {form} Textbooks (10 Subjects)
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Science & Tools */}
            <div>
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
                Specialized Resources
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => setCurrentView('practicals')}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Science Practicals Lab</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('ai-assistant')}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Study Assistant</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('quizzes')}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    NECTA Format Quizzes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('search')}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Curriculum Search
                  </button>
                </li>
              </ul>
            </div>

            {/* Tanzania Institute of Education & Examination Standard */}
            <div>
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
                Curriculum Compliance
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Organized according to the official national curriculum of Tanzania (TIE syllabus & NECTA CSEE/ACSEE guidelines).
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Jamhuri ya Muungano wa Tanzania</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px]">
            <span>© 2026 STUDY HUB AI. Built for Tanzanian Secondary School Students.</span>
            <span>Supporting O-Level (FTNA/CSEE) & A-Level (ACSEE) Candidates across Tanzania.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
