export type FormLevel = 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4' | 'Form 5' | 'Form 6';

export type SubjectId =
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'english'
  | 'kiswahili'
  | 'history'
  | 'geography'
  | 'civics'
  | 'ire';

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  swahiliName: string;
  category: 'Science' | 'Arts & Humanities' | 'Languages' | 'Religious Studies';
  color: string;
  accentColor: string;
  iconName: string;
  shortDesc: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nectaYearRef?: string;
}

export interface WorkedExample {
  title: string;
  problem: string;
  givenData?: string[];
  steps: string[];
  finalAnswer: string;
  keyTakeaway: string;
}

export interface ExerciseItem {
  id: string;
  question: string;
  hint: string;
  solution: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TopicSection {
  id: string;
  title: string;
  subtopics: string[];
  overview: string;
  notesMarkdown: string;
  examples: WorkedExample[];
  exercises: ExerciseItem[];
  revisionSummary: string[];
  pastPaperQuestions: {
    question: string;
    marks: number;
    yearRef: string;
    sampleAnswer: string;
  }[];
  quiz: QuizQuestion[];
}

export interface SubjectBook {
  id: string;
  form: FormLevel;
  subjectId: SubjectId;
  title: string;
  curriculumCode: string;
  edition: string;
  totalChapters: number;
  estimatedHours: number;
  description: string;
  chapters: TopicSection[];
}

export interface SciencePractical {
  id: string;
  subject: 'Physics' | 'Chemistry' | 'Biology';
  form: FormLevel;
  title: string;
  aim: string;
  safetyRules: string[];
  apparatus: string[];
  procedure: string[];
  expectedObservations: string;
  resultsFormula: string;
  sampleDataTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
  conclusion: string;
  discussionQuestions: {
    q: string;
    a: string;
  }[];
  nectaExamTip: string;
}

export interface BookmarkItem {
  id: string;
  type: 'topic' | 'note' | 'question' | 'practical';
  form: FormLevel;
  subjectId: SubjectId | 'practical';
  subjectName: string;
  title: string;
  subtitle: string;
  linkPath: {
    view: 'book' | 'practicals';
    form?: FormLevel;
    subjectId?: SubjectId;
    topicId?: string;
    practicalId?: string;
  };
  savedAt: string;
}

export interface QuizAttempt {
  id: string;
  bookId: string;
  subjectId: SubjectId;
  form: FormLevel;
  topicTitle: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export interface UserProgress {
  completedTopicIds: string[];
  quizAttempts: QuizAttempt[];
  questionsAnsweredCount: number;
  studyTimeMinutes: number;
  lastActive: string;
  recentActivity: {
    title: string;
    time: string;
    type: 'read' | 'quiz' | 'ai' | 'practical';
  }[];
}
