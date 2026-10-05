import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookMarked,
  Bot,
  Camera,
  Check,
  Copy,
  GraduationCap,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  Upload,
  User,
  Volume2,
  X,
} from 'lucide-react';
import { FormLevel, SubjectId } from '../types/curriculum';
import { FORM_CURRICULUM_OUTLINES, FORMS, SUBJECT_METAS } from '../data/curriculumData';
import { useApp } from '../context/AppContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  image?: {
    data: string;
    mimeType: string;
  };
}

export const AiAssistantView: React.FC = () => {
  const { aiContext, setAiContext, setCurrentView, toggleBookmark } = useApp();

  const [selectedForm, setSelectedForm] = useState<FormLevel>(aiContext.form || 'Form 3');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(aiContext.subject || 'physics');
  const [selectedTopic, setSelectedTopic] = useState<string>(
    aiContext.topic || 'Linear Motion and Newton’s Laws'
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        text: `**Habari! Welcome to STUDY HUB AI.**

I am your personal Tanzanian Curriculum AI Study Assistant. I am grounded in the **Tanzania Institute of Education (TIE)** syllabus and **NECTA** examination standards (CSEE & ACSEE).

Select your **Form**, **Subject**, and **Topic** above, then:
- Ask me to explain difficult concepts step-by-step.
- Request derivations or worked mathematical solutions.
- Upload a photo of a textbook problem or chalkboard question.
- Ask questions in English or Kiswahili!

*What would you like to master today?*`,
        timestamp: 'Just now',
      },
    ];
  });

  const [inputText, setInputText] = useState(aiContext.presetQuestion || '');
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available topics for chosen Form + Subject
  const availableTopics =
    FORM_CURRICULUM_OUTLINES[selectedForm]?.[selectedSubject]?.map((t) => t.title) || [
      'General Subject Topics',
    ];

  // Update selected topic if current is not in list
  useEffect(() => {
    if (!availableTopics.includes(selectedTopic)) {
      setSelectedTopic(availableTopics[0] || 'General Subject Topics');
    }
  }, [selectedForm, selectedSubject]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Preset Questions click
  const suggestedPrompts = [
    `Explain ${selectedTopic} in simple words for a ${selectedForm} student.`,
    `Give a step-by-step worked calculation example on ${selectedTopic}.`,
    `What are the most common NECTA exam questions asked on ${selectedTopic}?`,
    `Niandikie muhtasari wa mada hii ya ${selectedTopic} kwa lugha rahisi.`,
    `What are the key formulas and SI units I must remember for ${selectedTopic}?`,
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage({
        data: result,
        mimeType: file.type,
        preview: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: selectedImage
        ? {
            data: selectedImage.data,
            mimeType: selectedImage.mimeType,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    const imagePayload = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Build conversation history for server
      const historyPayload = messages
        .filter((m) => m.id !== 'msg-welcome')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          form: selectedForm,
          subject: SUBJECT_METAS[selectedSubject].name,
          topic: selectedTopic,
          history: historyPayload,
          image: imagePayload
            ? {
                data: imagePayload.data,
                mimeType: imagePayload.mimeType,
              }
            : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Samahani, could not process response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Offline fallback / error guidance
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `**Notice:** The AI Study Assistant requires an internet connection to reach our AI model.

In the meantime, you can explore the offline textbook notes, worked examples, and practicals for **${selectedForm} ${SUBJECT_METAS[selectedSubject].name}** right inside the app!

*Tip: Check your connection and click send again.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Start a new conversation? This will clear the current chat history.')) {
      setMessages([
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          text: `Started a fresh conversation for **${selectedForm} • ${SUBJECT_METAS[selectedSubject].name} • ${selectedTopic}**. How can I assist you?`,
          timestamp: 'Just now',
        },
      ]);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Library Home</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              AI Study Assistant
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Dedicated Tanzanian curriculum tutor — solves problems step-by-step and explains past paper questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            title="Start new conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* CURRICULUM CONTEXT SELECTOR: Form → Subject → Topic */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <GraduationCap className="w-4 h-4" />
          <span>Curriculum Targeting: Select Level, Subject & Topic</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Form Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Education Level
            </label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value as FormLevel)}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {FORMS.map((form) => (
                <option key={form} value={form}>
                  {form}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Subject Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {Object.values(SUBJECT_METAS).map((meta) => (
                <option key={meta.id} value={meta.id}>
                  {meta.name} ({meta.swahiliName})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Topic Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Specific Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableTopics.map((topic, i) => (
                <option key={i} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Context Ribbon */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>
            Current Focus:{' '}
            <strong className="text-emerald-700 dark:text-emerald-300">
              {selectedForm} • {SUBJECT_METAS[selectedSubject].name} • {selectedTopic}
            </strong>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">TIE / NECTA Model</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold uppercase text-slate-400 px-1">Suggested Questions:</div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT MESSAGES DISPLAY */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-emerald-600'
                    : 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className="space-y-1">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {/* Attached photo thumbnail if present */}
                  {msg.image && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 max-w-xs">
                      <img
                        src={msg.image.data}
                        alt="Question snapshot"
                        className="w-full h-auto object-cover max-h-48"
                      />
                    </div>
                  )}

                  <div className="whitespace-pre-line prose dark:prose-invert max-w-none text-xs sm:text-sm">
                    {msg.text}
                  </div>
                </div>

                {/* Footer timestamp & copy */}
                <div
                  className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
                      title="Copy explanation"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Analyzing curriculum problem & formulating step-by-step guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR WITH PHOTO UPLOAD & SEND */}
      <div className="space-y-2">
        {/* Selected image preview thumbnail bar */}
        {selectedImage && (
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedImage.preview}
                alt="Selected"
                className="w-12 h-12 object-cover rounded-lg border border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Photo question attached
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  AI will analyze and solve this problem step-by-step.
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedImage(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text Input Row */}
        <div className="flex items-end gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Photo upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Upload or take photo of a question"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Text area */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Ask a question on ${selectedTopic} or upload a problem...`}
            rows={1}
            className="flex-1 bg-transparent py-2 px-1 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none max-h-32"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isLoading || (!inputText.trim() && !selectedImage)}
            className={`p-2.5 rounded-xl text-white font-bold transition-all shadow-sm ${
              isLoading || (!inputText.trim() && !selectedImage)
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-600/30'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
          <span>Tip: Press Enter to send, Shift+Enter for new line.</span>
          <span>NECTA Examination Tutor Standard</span>
        </div>
      </div>
    </div>
  );
};
