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
app.use(express.static(path.join(__dirname, 'public')))

// API route
app.get('/api/materials', async (req, res) => {
  try {
    const urls = Array.isArray(req.query.urls)
      ? req.query.urls
      : [req.query.urls];

    const results = await scrapeWithRetry(urls);

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

async function scrapeWithRetry(urls, maxRetries = 3) {
  const results = new Array(urls.length).fill(null);
  const failedIndices = new Set();

  // Initial attempt
  const initialResults = await Promise.allSettled(
    urls.map(url => scrapeMaterials(url))
  );

  initialResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      results[index] = result.value;
    } else {
      failedIndices.add(index);
      console.log(`Initial scrape failed for URL ${index}: ${urls[index]}`);
    }
  });

  // Retry failed requests
  for (let attempt = 1; attempt <= maxRetries && failedIndices.size > 0; attempt++) {
    console.log(`Retry attempt ${attempt} for ${failedIndices.size} failed URLs`);

    // Add exponential backoff delay
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));

    const retryPromises = Array.from(failedIndices).map(async (index) => {
      try {
        const result = await scrapeMaterials(urls[index]);
        return { index, result };
      } catch (error) {
        console.error(`Retry ${attempt} failed for URL ${index}:`, error.message);
        return { index, result: [] };
      }
    });

    const retryResults = await Promise.allSettled(retryPromises);

    retryResults.forEach((promiseResult) => {
      if (promiseResult.status === 'fulfilled') {
        const { index, result } = promiseResult.value;
        if (result.length > 0) {
          results[index] = result;
          failedIndices.delete(index);
          console.log(`✅ Successfully scraped URL ${index} on retry ${attempt}`);
        }
      }
    });
  }

  // Fill remaining failed requests with empty arrays
  failedIndices.forEach(index => {
    results[index] = [];
    console.log(`❌ Final failure for URL ${index}: ${urls[index]}`);
  });

  return results;
}

// Catch-all route to serve Vue app for SPA support
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
