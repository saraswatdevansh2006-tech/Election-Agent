import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Secure AI Proxy Route
app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, model = 'gemini-2.5-flash', jsonMode = false } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const genAI = new GoogleGenAI(apiKey);
    const aiModel = genAI.getGenerativeModel({ 
      model,
      generationConfig: jsonMode ? { responseMimeType: 'application/json' } : undefined
    });

    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error('AI Proxy Error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
