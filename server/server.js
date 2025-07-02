const express = require('express');
const cors = require('cors');
const scrapeMaterials = require('./scraper');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
}));

app.use(express.json());

// Serve static frontend build
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// API route
app.get('/api/materials', async (req, res) => {
  try {
    const urls = Array.isArray(req.query.urls)
      ? req.query.urls
      : [req.query.urls];

    const results = await Promise.all(
      urls.map(url => scrapeMaterials(url))
    );

    const responseMap = {};
    urls.forEach((url, i) => {
      responseMap[url] = results[i];
    });

    res.json(responseMap);
  } catch (err) {
    console.error('Scraping error:', err);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

// Catch-all route to serve Vue app for SPA support
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
