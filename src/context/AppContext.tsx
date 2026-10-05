import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BookmarkItem,
  FormLevel,
  QuizAttempt,
  SciencePractical,
  SubjectBook,
  SubjectId,
  UserProgress,
} from '../types/curriculum';
import { getAllBooksForForm, getSubjectBook, SUBJECT_METAS } from '../data/curriculumData';
import { SCIENCE_PRACTICALS } from '../data/practicalsData';

export type AppView =
  | 'home'
  | 'form-subjects'
  | 'book-reader'
  | 'practicals'
  | 'ai-assistant'
  | 'search'
  | 'quizzes'
  | 'progress'
  | 'bookmarks';

export type ReaderTab = 'toc' | 'notes' | 'examples' | 'exercises' | 'revision' | 'quiz';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedForm: FormLevel;
  setSelectedForm: (form: FormLevel) => void;
  selectedSubjectId: SubjectId;
  setSelectedSubjectId: (id: SubjectId) => void;
  currentBook: SubjectBook | null;
  activeChapterIndex: number;
  setActiveChapterIndex: (idx: number) => void;
  activeReaderTab: ReaderTab;
  setActiveReaderTab: (tab: ReaderTab) => void;
  selectedPractical: SciencePractical | null;
  setSelectedPractical: (p: SciencePractical | null) => void;
  bookmarks: BookmarkItem[];
  toggleBookmark: (item: Omit<BookmarkItem, 'id' | 'savedAt'>) => void;
  isBookmarked: (title: string) => boolean;
  userProgress: UserProgress;
  recordQuizScore: (attempt: Omit<QuizAttempt, 'id' | 'date'>) => void;
  markTopicCompleted: (topicId: string, title: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  aiContext: { form: FormLevel; subject: SubjectId; topic: string; presetQuestion?: string };
  setAiContext: React.Dispatch<
    React.SetStateAction<{ form: FormLevel; subject: SubjectId; topic: string; presetQuestion?: string }>
  >;
  openForm: (form: FormLevel) => void;
  openBook: (form: FormLevel, subjectId: SubjectId, chapterIdx?: number, tab?: ReaderTab) => void;
  openPractical: (practicalId: string) => void;
  askAiAboutTopic: (form: FormLevel, subjectId: SubjectId, topicTitle: string, question?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BOOKMARKS_KEY = 'study_hub_ai_bookmarks';
const PROGRESS_KEY = 'study_hub_ai_progress';
const THEME_KEY = 'study_hub_ai_theme';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedForm, setSelectedForm] = useState<FormLevel>('Form 1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('mathematics');
  const [currentBook, setCurrentBook] = useState<SubjectBook | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [activeReaderTab, setActiveReaderTab] = useState<ReaderTab>('notes');
  const [selectedPractical, setSelectedPractical] = useState<SciencePractical | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [aiContext, setAiContext] = useState<{
    form: FormLevel;
    subject: SubjectId;
    topic: string;
    presetQuestion?: string;
  }>({
    form: 'Form 1',
    subject: 'mathematics',
    topic: 'Numbers and Fractions',
  });

  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(BOOKMARKS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (item: Omit<BookmarkItem, 'id' | 'savedAt'>) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.title === item.title && b.form === item.form);
      if (exists) {
        return prev.filter((b) => !(b.title === item.title && b.form === item.form));
      } else {
        const newItem: BookmarkItem = {
          ...item,
          id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          savedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        };
        return [newItem, ...prev];
      }
    });
  };

  const isBookmarked = (title: string): boolean => {
    return bookmarks.some((b) => b.title === title);
  };

  // Progress state
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(PROGRESS_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      completedTopicIds: [],
      quizAttempts: [],
      questionsAnsweredCount: 0,
      studyTimeMinutes: 35,
      lastActive: new Date().toISOString(),
      recentActivity: [
        {
          title: 'Explored Form 1 Mathematics: Numbers and Fractions',
          time: '15 mins ago',
          type: 'read',
        },
      ],
    };
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(userProgress));
  }, [userProgress]);

  const markTopicCompleted = (topicId: string, title: string) => {
    setUserProgress((prev) => {
      if (prev.completedTopicIds.includes(topicId)) return prev;
      return {
        ...prev,
        completedTopicIds: [...prev.completedTopicIds, topicId],
        recentActivity: [
          {
            title: `Completed ${title}`,
            time: 'Just now',
            type: 'read',
          },
          ...prev.recentActivity.slice(0, 9),
        ],
      };
    });
  };

  const recordQuizScore = (attempt: Omit<QuizAttempt, 'id' | 'date'>) => {
    const fullAttempt: QuizAttempt = {
      ...attempt,
      id: `qa-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    };

    setUserProgress((prev) => ({
      ...prev,
      quizAttempts: [fullAttempt, ...prev.quizAttempts],
      questionsAnsweredCount: prev.questionsAnsweredCount + attempt.total,
      recentActivity: [
        {
          title: `Quiz: ${attempt.topicTitle} (${attempt.score}/${attempt.total} - ${Math.round(attempt.percentage)}%)`,
          time: 'Just now',
          type: 'quiz',
        },
        ...prev.recentActivity.slice(0, 9),
      ],
    }));
  };

  // Navigation helpers
  const openForm = (form: FormLevel) => {
    setSelectedForm(form);
    setCurrentView('form-subjects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBook = (form: FormLevel, subjectId: SubjectId, chapterIdx = 0, tab: ReaderTab = 'notes') => {
    setSelectedForm(form);
    setSelectedSubjectId(subjectId);
    const book = getSubjectBook(form, subjectId);
    setCurrentBook(book);
    setActiveChapterIndex(chapterIdx);
    setActiveReaderTab(tab);
    setCurrentView('book-reader');

    // Update recent activity
    const chapterTitle = book.chapters[chapterIdx]?.title || book.title;
    setUserProgress((prev) => ({
      ...prev,
      recentActivity: [
        {
          title: `Studying ${book.form} ${SUBJECT_METAS[subjectId].name}: ${chapterTitle}`,
          time: 'Just now',
          type: 'read',
        },
        ...prev.recentActivity.slice(0, 9),
      ],
    }));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPractical = (practicalId: string) => {
    const prac = SCIENCE_PRACTICALS.find((p) => p.id === practicalId) || SCIENCE_PRACTICALS[0];
    setSelectedPractical(prac);
    setCurrentView('practicals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const askAiAboutTopic = (
    form: FormLevel,
    subjectId: SubjectId,
    topicTitle: string,
    presetQuestion?: string
  ) => {
    setAiContext({
      form,
      subject: subjectId,
      topic: topicTitle,
      presetQuestion:
        presetQuestion || `Can you teach me the core principles of ${topicTitle} according to the Tanzanian curriculum?`,
    });
    setCurrentView('ai-assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedForm,
        setSelectedForm,
        selectedSubjectId,
        setSelectedSubjectId,
        currentBook,
        activeChapterIndex,
        setActiveChapterIndex,
        activeReaderTab,
        setActiveReaderTab,
        selectedPractical,
        setSelectedPractical,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        userProgress,
        recordQuizScore,
        markTopicCompleted,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        aiContext,
        setAiContext,
        openForm,
        openBook,
        openPractical,
        askAiAboutTopic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
