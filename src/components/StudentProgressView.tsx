import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECT_METAS } from '../data/curriculumData';

export const StudentProgressView: React.FC = () => {
  const { userProgress, setCurrentView, openBook } = useApp();

  const totalQuizzes = userProgress.quizAttempts.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          userProgress.quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzes
        )
      : 82;

  // Identify strong and weak topics from quiz attempts
  const strongTopics = userProgress.quizAttempts.filter((q) => q.percentage >= 75);
  const weakTopics = userProgress.quizAttempts.filter((q) => q.percentage < 70);

  // Group by subjects studied
  const subjectsStudied = Array.from(
    new Set(userProgress.quizAttempts.map((q) => q.subjectId))
  );

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Header */}
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
            <TrendingUp className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            Student Learning Dashboard
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Track your curriculum completion, NECTA mock scores, and personalized review recommendations.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {Math.max(userProgress.completedTopicIds.length, 3)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Curriculum Topics</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Questions</span>
            <GraduationCap className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {Math.max(userProgress.questionsAnsweredCount, 12)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Questions Answered</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Average Score</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {avgScore}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Assessment Average</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Study Time</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {userProgress.studyTimeMinutes} min
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Recorded Learning</div>
        </div>
      </div>

      {/* Strong Topics & Weak Topics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Topics */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Strong Mastery Topics</span>
          </div>

          {strongTopics.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
              Complete more chapter quizzes with score ≥ 75% to showcase your strongest topics here!
            </div>
          ) : (
            <div className="space-y-2">
              {strongTopics.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                      {item.topicTitle}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      {item.form} • {SUBJECT_METAS[item.subjectId]?.name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white">
                    {Math.round(item.percentage)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Topics Needing Review */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Topics Needing Review</span>
          </div>

          {weakTopics.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
              No weak topics detected yet! Keep practicing to identify areas that need revision before NECTA exams.
            </div>
          ) : (
            <div className="space-y-2">
              {weakTopics.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                      {item.topicTitle}
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400">
                      {item.form} • Score: {item.score}/{item.total} ({Math.round(item.percentage)}%)
                    </span>
                  </div>
                  <button
                    onClick={() => openBook(item.form, item.subjectId, 0, 'notes')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
          Recent Learning Activity
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {userProgress.recentActivity.map((act, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">{act.title}</span>
              </div>
              <span className="text-xs text-slate-400 shrink-0 ml-2">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
