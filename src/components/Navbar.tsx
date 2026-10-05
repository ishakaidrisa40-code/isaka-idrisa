import React, { useState } from 'react';
import {
  BookMarked,
  BookOpen,
  FlaskConical,
  GraduationCap,
  History,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FORMS } from '../data/curriculumData';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedForm,
    openForm,
    theme,
    toggleTheme,
    bookmarks,
    userProgress,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formsDropdownOpen, setFormsDropdownOpen] = useState(false);

  const navItems = [
    {
      id: 'home',
      label: 'Home Library',
      icon: BookOpen,
      action: () => setCurrentView('home'),
      active: currentView === 'home',
    },
    {
      id: 'practicals',
      label: 'Science Practicals',
      icon: FlaskConical,
      action: () => setCurrentView('practicals'),
      active: currentView === 'practicals',
    },
    {
      id: 'ai-assistant',
      label: 'AI Study Assistant',
      icon: Sparkles,
      action: () => setCurrentView('ai-assistant'),
      active: currentView === 'ai-assistant',
      highlight: true,
    },
    {
      id: 'quizzes',
      label: 'Quizzes',
      icon: GraduationCap,
      action: () => setCurrentView('quizzes'),
      active: currentView === 'quizzes',
    },
    {
      id: 'progress',
      label: 'My Progress',
      icon: LayoutDashboard,
      action: () => setCurrentView('progress'),
      active: currentView === 'progress',
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      icon: BookMarked,
      action: () => setCurrentView('bookmarks'),
      active: currentView === 'bookmarks',
      count: bookmarks.length,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Tanzanian Emblem badge */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-0.5 shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center relative overflow-hidden">
                {/* Tanzania Flag Stripe motif */}
                <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-emerald-500 via-amber-400 to-sky-500" />
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg sm:text-xl font-sans text-slate-900 dark:text-white">
                  STUDY HUB <span className="text-emerald-600 dark:text-emerald-400">AI</span>
                </span>
                <span className="hidden xs:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  TZ
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                Tanzanian Digital Learning Library
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Form switcher dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFormsDropdownOpen(!formsDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Level:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedForm}</span>
              </button>

              {formsDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setFormsDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Secondary Form
                  </div>
                  {FORMS.map((form) => (
                    <button
                      key={form}
                      type="button"
                      onClick={() => {
                        openForm(form);
                        setFormsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedForm === form
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span>{form}</span>
                      <span className="text-[10px] text-slate-400 font-mono">10 Books</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    item.active
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : item.highlight
                      ? 'bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Theme, Mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Quick search button */}
            <button
              onClick={() => setCurrentView('search')}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Search topics, formulas and textbooks"
            >
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline text-slate-500 dark:text-slate-400">Search curriculum...</span>
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Select Education Level
            </div>
            <div className="grid grid-cols-3 gap-1.5 pb-2">
              {FORMS.map((form) => (
                <button
                  key={form}
                  onClick={() => {
                    openForm(form);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-colors ${
                    selectedForm === form
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {form}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    item.active
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
