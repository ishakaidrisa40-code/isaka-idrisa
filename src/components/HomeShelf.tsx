import React from 'react';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  FileCheck,
  FlaskConical,
  GraduationCap,
  Layers,
  Library,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { FormLevel } from '../types/curriculum';
import { FORMS, SUBJECT_METAS } from '../data/curriculumData';
import { useApp } from '../context/AppContext';

export const HomeShelf: React.FC = () => {
  const { openForm, setCurrentView, openBook, openPractical, userProgress } = useApp();

  const formVisualThemes: Record<
    FormLevel,
    {
      gradient: string;
      accent: string;
      levelBadge: string;
      tagline: string;
      description: string;
      nectaExam: string;
    }
  > = {
    'Form 1': {
      gradient: 'from-emerald-700 via-teal-800 to-slate-900',
      accent: 'border-emerald-400 text-emerald-300',
      levelBadge: 'Ordinary Level (O-Level)',
      tagline: 'Foundation of Secondary Education',
      description: 'Orientation to secondary science, mathematics, language arts, and social studies.',
      nectaExam: 'Secondary Foundation',
    },
    'Form 2': {
      gradient: 'from-blue-700 via-indigo-800 to-slate-900',
      accent: 'border-blue-400 text-blue-300',
      levelBadge: 'Ordinary Level (FTNA Prep)',
      tagline: 'National Assessment Level',
      description: 'Intermediate secondary syllabus preparing students for Form Two National Assessment (FTNA).',
      nectaExam: 'FTNA Examination Level',
    },
    'Form 3': {
      gradient: 'from-amber-700 via-orange-800 to-slate-900',
      accent: 'border-amber-400 text-amber-300',
      levelBadge: 'Ordinary Level (Specialization)',
      tagline: 'Advanced Subject Specialization',
      description: 'In-depth theoretical foundations and rigorous laboratory practical methodologies.',
      nectaExam: 'Pre-CSEE Standard',
    },
    'Form 4': {
      gradient: 'from-rose-800 via-red-900 to-slate-950',
      accent: 'border-rose-400 text-rose-300',
      levelBadge: 'Ordinary Level (CSEE Mastery)',
      tagline: 'Certificate of Secondary Education',
      description: 'Comprehensive NECTA CSEE past paper questions, formula sheets, and practical mock papers.',
      nectaExam: 'NECTA CSEE National Examination',
    },
    'Form 5': {
      gradient: 'from-purple-800 via-indigo-950 to-slate-950',
      accent: 'border-purple-400 text-purple-300',
      levelBadge: 'Advanced Level (A-Level)',
      tagline: 'High School & Pre-University',
      description: 'Advanced pure mathematics, advanced physics, chemistry, biology, and language disciplines.',
      nectaExam: 'Advanced Level Form 5',
    },
    'Form 6': {
      gradient: 'from-teal-800 via-emerald-950 to-slate-950',
      accent: 'border-teal-400 text-teal-300',
      levelBadge: 'Advanced Level (ACSEE Graduation)',
      tagline: 'Advanced Certificate of Education',
      description: 'Mastery of ACSEE curriculum with calculus, organic mechanisms, quantum physics & university prep.',
      nectaExam: 'NECTA ACSEE National Examination',
    },
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-emerald-800/40">
        {/* Subtle decorative glow and background pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Official Tanzanian Secondary Curriculum Library</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif leading-tight">
            STUDY HUB <span className="text-emerald-400">AI</span>
          </h1>

          <p className="mt-2 text-lg sm:text-xl font-medium text-emerald-200">
            Tanzanian Digital Learning Library
          </p>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Empowering Tanzanian secondary school students from <strong className="text-white">Form 1 to Form 6</strong> with
            authentic textbooks, chapter notes, worked examples, interactive quizzes, science practicals, and a dedicated AI Study Tutor.
          </p>

          {/* Quick action buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openForm('Form 1')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 group"
            >
              <span>Explore Form Textbooks</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentView('ai-assistant')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask AI Study Tutor</span>
            </button>

            <button
              onClick={() => setCurrentView('practicals')}
              className="px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Science Practicals</span>
            </button>
          </div>

          {/* Quick stats banner */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">6 Levels</div>
              <div className="text-slate-400 font-medium">Form 1 to Form 6</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">60 Textbooks</div>
              <div className="text-slate-400 font-medium">10 Core Subjects Each</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-sky-400">NECTA Aligned</div>
              <div className="text-slate-400 font-medium">CSEE & ACSEE Standard</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-rose-400">AI Powered</div>
              <div className="text-slate-400 font-medium">Step-by-Step Problem Solver</div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION LEVELS DISPLAYED AS REAL TANZANIAN BOOKS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Library className="w-4 h-4" />
              <span>Education Levels Shelf</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white mt-1">
              Select Your Form Level
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Each Form book opens 10 separate subject textbooks designed specifically for that academic level.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Tanzania Institute of Education (TIE) Syllabus</span>
          </div>
        </div>

        {/* 6 Real Form Level Textbook Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FORMS.map((form) => {
            const visual = formVisualThemes[form];

            return (
              <div
                key={form}
                onClick={() => openForm(form)}
                className="group relative cursor-pointer select-none"
              >
                {/* 3D Realistic Large Form Book */}
                <div
                  className={`relative rounded-r-2xl rounded-l-md overflow-hidden bg-gradient-to-br ${visual.gradient} 
                    p-6 text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-950/40 
                    border border-white/10 active:scale-[0.99] shadow-xl`}
                  style={{ minHeight: '360px' }}
                >
                  {/* Book spine simulation on the left */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/60 via-white/20 to-black/40 z-20 pointer-events-none" />
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-black/30 z-20 pointer-events-none" />

                  {/* Paper edge on the right */}
                  <div className="absolute right-0 top-1 bottom-1 w-1.5 bg-gradient-to-l from-amber-100 to-amber-50 dark:from-slate-700 dark:to-slate-800 border-l border-amber-300/40" />

                  {/* Top corner Tanzanian flag decorative badge */}
                  <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none overflow-hidden">
                    <div className="absolute transform rotate-45 bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-600 text-center text-[9px] font-black py-0.5 right-[-40px] top-[22px] w-[140px] shadow-sm text-black">
                      TANZANIA
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                    {/* Header info */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-white/20 border border-white/30 text-amber-200">
                          {visual.levelBadge}
                        </span>

                        <span className="text-[10px] text-white/70 font-mono">10 Subjects</span>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full border border-amber-300 flex items-center justify-center text-[9px] font-extrabold text-amber-300">
                          TZ
                        </div>
                        <span className="text-[10px] font-semibold text-amber-200/90 tracking-wide uppercase">
                          National Secondary Curriculum
                        </span>
                      </div>
                    </div>

                    {/* Book Core Title */}
                    <div className="text-center py-4">
                      <div className="text-xs uppercase font-bold tracking-widest text-emerald-300 opacity-90">
                        OFFICIAL CURRICULUM
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-extrabold font-serif text-white tracking-tight drop-shadow-md mt-1">
                        {form}
                      </h3>
                      <p className="text-xs font-semibold text-amber-200 mt-1 italic">
                        {visual.tagline}
                      </p>

                      <div className="mt-3 mx-auto w-16 h-1 bg-amber-400 rounded-full" />

                      <p className="mt-3 text-xs text-white/80 line-clamp-3 leading-relaxed px-2 font-sans">
                        {visual.description}
                      </p>
                    </div>

                    {/* Footer with NECTA tag & Open CTA */}
                    <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                      <div className="text-[10px]">
                        <span className="block font-bold text-white">{visual.nectaExam}</span>
                        <span className="text-emerald-300/90">Complete Subject Library</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                        <span>Open Shelf</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtitle / Subject preview below each form */}
                <div className="mt-2.5 px-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Mathematics • Physics • Chemistry • Kiswahili + 6 more</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Explore</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SPECIAL SCIENCE PRACTICALS HIGHLIGHT */}
      <section className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Laboratory Manuals & Experimental Protocols</span>
            </div>
            <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
              Dedicated Science Practicals Section
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Step-by-step practical guides for <strong className="text-slate-900 dark:text-slate-100">Physics, Chemistry, and Biology</strong>.
              Includes apparatus inventories, safety rules, detailed procedures, expected observation tables, calculation formulas, and NECTA practical exam tips.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('practicals')}
            className="self-start md:self-auto px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <span>View Science Practicals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Quick Cards for Physics, Chemistry, Biology Practicals */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => openPractical('phys-form1-pendulum')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 cursor-pointer transition-all hover:shadow-md group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
              Physics Practicals
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Pendulum g determination, Hooke’s Law, Ohm’s Law & Glass Block Refraction.
            </p>
          </div>

          <div
            onClick={() => openPractical('chem-form3-titration-acid-base')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 cursor-pointer transition-all hover:shadow-md group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              Chemistry Practicals
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Volumetric titration (HCl vs Na₂CO₃), Qualitative salt analysis (Cations & Anions).
            </p>
          </div>

          <div
            onClick={() => openPractical('bio-form2-food-tests')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-green-400 cursor-pointer transition-all hover:shadow-md group"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mb-3">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
              Biology Practicals
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Food tests (Starch, Reducing Sugars, Proteins, Lipids) & Plant Osmosis with potato cylinders.
            </p>
          </div>
        </div>
      </section>

      {/* AI ASSISTANT BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-800/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Tanzanian Curriculum AI Tutor</span>
            </div>
            <h3 className="text-2xl font-bold font-serif text-white">
              Stuck on a Difficult Concept or Exam Calculation?
            </h3>
            <p className="text-sm text-slate-300">
              Select your <strong>Form</strong>, <strong>Subject</strong>, and <strong>Topic</strong> to get step-by-step
              derivations, Swahili contextual explanations, or upload a photo of your school homework!
            </p>
          </div>

          <button
            onClick={() => setCurrentView('ai-assistant')}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Assistant</span>
          </button>
        </div>
      </section>
    </div>
  );
};
