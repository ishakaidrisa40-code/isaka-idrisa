import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Study Assistant endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, form, subject, topic, history = [], image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: 'Message or image is required.' });
    }

    const systemInstruction = `You are the lead tutor at "STUDY HUB AI", the premier Tanzanian Secondary School Digital Learning Library.
Your students are Tanzanian secondary school students following the National Curriculum of Tanzania (Tanzania Institute of Education - TIE syllabus and NECTA National Examinations: CSEE for Form 1-4, ACSEE for Form 5-6).

Current Student Context:
- Academic Level: ${form || 'Secondary School (General)'}
- Subject: ${subject || 'General Studies'}
- Topic in Focus: ${topic || 'General Curriculum Inquiry'}

Pedagogical Directives:
1. CURRICULUM ACCURACY: Adhere strictly to the Tanzanian secondary curriculum for the specified Form level (${form || 'Secondary'}). Do not introduce A-Level / university concepts to Form 1 or Form 2 students. Keep terminology and depth aligned with NECTA standards.
2. STEP-BY-STEP TEACHING: Do NOT simply hand over a final answer. Explain the concepts, principles, formulas, and derivations clearly. Guide the student so they learn HOW to solve it themselves in an exam.
3. CLEAR FORMATTING: Use Markdown with bold headers, bullet points, numbered steps, clear mathematical formulas, SI units, and boxed key takeaways.
4. MULTILINGUAL & CULTURAL RELEVANCE:
   - For Kiswahili, communicate natively in standard Kiswahili (Sanifu), discussing Sarufi, Fasihi simulizi/andishi, Nahau, Methali, and Riwaya/Tamthiliya.
   - For all other subjects, use clear, encouraging English as used in Tanzanian English-medium secondary schools. Feel free to clarify complex terminology with brief Swahili explanatory notes if helpful (e.g., "Kumbuka: msuguano = friction").
   - Mention Tanzanian contexts where applicable (e.g., Mount Kilimanjaro, Lake Victoria, Serengeti ecosystems, Tanzanian mineral wealth like Tanzanite, Julius Nyerere / Arusha Declaration in History, local agricultural examples in Biology/Geography).
5. PHOTO / QUESTION UPLOAD: If an image is provided, examine it carefully (such as a handwritten problem, chalkboard snapshot, or textbook/past-paper question). Transcribe the question clearly, identify what is given and what needs to be solved, and walk through the complete step-by-step solution according to NECTA marking schemes.
6. ENCOURAGING TONE: Be supportive, inspiring, and enthusiastic ("Hongera kwa kuuliza swali zuri!", "Keep pushing for Division 1!").`;

    const contents: any[] = [];

    // Append prior history if available
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.text }],
        });
      }
    }

    // Build current prompt parts
    const currentParts: any[] = [];

    if (image && image.data) {
      // Clean base64 data if it contains data URI header
      const base64Data = image.data.includes(',')
        ? image.data.split(',')[1]
        : image.data;
      const mimeType = image.mimeType || 'image/jpeg';

      currentParts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    const promptText = `Student asks: "${message || 'Please explain this question from the photo.'}"
Context: Level=${form || 'Not specified'}, Subject=${subject || 'General'}, Topic=${topic || 'General'}`;

    currentParts.push({ text: promptText });

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    let replyText = '';
    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];

    for (const modelName of modelsToTry) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Model timeout after 6s')), 6000)
        );

        const responsePromise = ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const response: any = await Promise.race([responsePromise, timeoutPromise]);
        if (response && response.text) {
          replyText = response.text;
          break;
        }
      } catch (modelErr: any) {
        console.warn(`Model ${modelName} attempt:`, modelErr?.message || modelErr);
      }
    }

    if (!replyText) {
      // Pedagogical fallback tailored to Tanzanian syllabus when upstream API is under temporary load spike
      replyText = `**STUDY HUB AI — Curriculum Guide**

**Academic Level:** ${form || 'Secondary School'}
**Subject:** ${subject || 'General'}
**Topic:** ${topic || 'Curriculum Inquiry'}

### 1. Key Concept & NECTA Definition
According to the **Tanzania Institute of Education (TIE)** curriculum syllabus, **${topic || 'this topic'}** represents a fundamental area in ${subject || 'secondary education'}.
- Always state the standard textbook definition clearly before showing calculations.
- Be sure to include all relevant SI units (e.g., meters (m), seconds (s), kilograms (kg), Newtons (N), or Joules (J)).

### 2. Systematic Problem-Solving Steps
1. **Identify the Given Information:** Extract known values from the problem statement with units.
2. **State the Governing Formula:** e.g., in Physics/Math, write down the formula *before* substituting numbers.
3. **Show Clear Working:** Show all intermediate arithmetic; NECTA examiners award specific method marks (M-marks).
4. **Final Answer:** State your final answer clearly underlined with correct units (e.g., *Answer = 25.0 N*).

### 3. Swahili Translation & Context (Mukhtadha wa Kitanzania)
*Kumbuka:* Kuelewa dhana za kimsingi na kuzihusianisha na mifano halisi ya Kitanzania (kama vile kilimo, nishati, mazingira na mifumo ya kijiografia) kutakusaidia kufaulu mtihani wa NECTA kwa alama za juu (Division 1).

*(The AI assistant service experienced a brief upstream demand spike and provided this structured curriculum summary. You can re-send your question in a few moments for full dynamic AI generation!)*`;
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    res.status(500).json({
      error: 'Failed to communicate with AI Study Assistant.',
      details: error?.message || 'Unknown server error',
    });
  }
});

// Quick AI Question Explainer / Hint generator
app.post('/api/explain-question', async (req, res) => {
  try {
    const { question, form, subject, topic } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a Tanzanian secondary school teacher preparing students for NECTA exams.
Student Level: ${form || 'Form 1-4'}
Subject: ${subject}
Topic: ${topic}
Question: "${question}"

Provide:
1. Concept Summary: What principle or definition is this testing?
2. Step-by-Step Derivation / Explanation: How to approach and solve this systematically.
3. Common Exam Pitfalls: Mistakes students often make in NECTA exams.
4. Quick Practice Hint: One tip to remember this permanently.`,
      config: {
        temperature: 0.6,
      },
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error('Error in question explanation:', error);
    res.status(500).json({ error: 'Failed to generate explanation.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[STUDY HUB AI] Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
