const express = require('express');
const cors = require('cors');
const scrapeMaterials = require('./scraper');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080'
}));

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

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
