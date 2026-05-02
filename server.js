import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the 'dist' directory, but don't serve index.html automatically
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

// Handle SPA routing: serve index.html with environment variable injection
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  import('fs').then(fs => {
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading index.html');
      }
      const injected = data.replace(
        '</head>',
        `<script>window.GEMINI_API_KEY = "${process.env.GEMINI_API_KEY || ''}";</script></head>`
      );
      res.send(injected);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
