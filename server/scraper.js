const axios = require('axios');
const cheerio = require('cheerio');

const cache = new Map();
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

async function scrapeMaterials(url) {
  const now = Date.now();

  // Check if result is cached and still valid
  const cached = cache.get(url);
  if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }

  try {
    // Timeout and retry logic
    const { data } = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html'
      },
      decompress: true
    });

    const $ = cheerio.load(data);
    const products = [];

    $('div[data-testid="product-pod"]').each((_, el) => {
      const $el = $(el);
      const brand = $el.find('[data-testid="attribute-brandname-above"]').text().trim();
      const title = $el.find('[data-testid="attribute-product-label"]').text().trim();

      const anchor = $el.find('a[href*="/p/"]').first();
      const fullLink = anchor.length ? `https://www.homedepot.com${anchor.attr('href')}` : '';

      const priceSpans = $el.find('[data-testid="price-simple"] span');
      const price = priceSpans.length >= 4
        ? `$${priceSpans.eq(1).text().trim()}.${priceSpans.eq(3).text().trim()}`
        : '';

      const bulkText = $el.find('[data-testid="bulk-price-container"]').text().trim();
      const bulkMatch = bulkText.match(/Buy\s+(\d+)[^$]*\$(\d+\.\d+)/);
      const bulkPricing = bulkMatch
        ? { quantity: parseInt(bulkMatch[1]), price: `$${bulkMatch[2]}` }
        : null;

      // Lazy image stuff, try to find work around later
      const image = $el.find('img');
      const imageUrl = image.attr('src') || image.attr('data-src') || image.attr('data-srcset') || '';

      if (title && fullLink && price) {
        products.push({
          brand,
          title,
          price,
          link: fullLink,
          imageUrl,
          bulkPricing
        });
      }
    });

    // Cache result with timestamp
    cache.set(url, { data: products, timestamp: now });
    console.log(products)
    return products;
  } catch (err) {
    console.error('Scraping error:', err.message);
    return [];
  }
}

module.exports = scrapeMaterials;
