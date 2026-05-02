import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Middleware for better performance
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: true
}));

// Secure AI Proxy Route
app.post('/api/ai', async (req, res) => {
  const { prompt, model = 'gemini-1.5-flash', jsonMode = false } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  console.log(`AI Request received: prompt length=${prompt?.length}, model=${model}, jsonMode=${jsonMode}`);

  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is not set in the environment.');
    return res.status(500).json({ error: 'AI Assistant is currently unavailable (Configuration Error)' });
  }

  try {
    const genAI = new GoogleGenAI(apiKey);
    const aiModel = genAI.getGenerativeModel({ 
      model,
      generationConfig: jsonMode ? { responseMimeType: 'application/json' } : undefined
    });

    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`AI Response success: text length=${text.length}`);
    res.json({ text });
  } catch (error) {
    console.error('AI Proxy Error:', error.message);
    res.status(500).json({ 
      error: 'The assistant encountered an error.',
      message: error.message
    });
  }
});

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`VoterVoice Server running on port ${port}`);
});
