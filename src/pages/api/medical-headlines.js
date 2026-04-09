// pages/api/medical-headlines.js
import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 5000, // Strict timeout to prevent stalling
});

// 1. Stable Fallback Library (Archival Evidence)
// Used when network failures occur or sources are unreachable.
const FALLBACK_HEADLINES = [
  { id: 'f1', source: 'UCCR Archive', title: 'New Multi-disciplinary Case Study on Rare Tropical Presenting Signs', url: '/search' },
  { id: 'f2', source: 'Makerere Research', title: 'Long-term Outcomes of Surgical Innovation in Low-Resource Settings', url: '/search' },
  { id: 'f3', source: 'WHO Africa', title: 'Coordinated Strategy for Managing Emerging Infectious Triage', url: '/search' },
  { id: 'f4', source: 'East African Medical', title: 'Recent Advances in Clinical Examination for Rural Health Centers', url: '/search' },
  { id: 'f5', source: 'Africa CDC', title: 'Public Health Alert: Strengthening Genomic Surveillance across the Region', url: '/search' }
];

const sources = {
  "Makerere University": "https://news.mak.ac.ug/category/research/feed/",
  "Africa CDC": "https://africacdc.org/feed/",
  "WHO Africa": "https://www.afro.who.int/rss.xml",
  "BMJ Case Reports": "https://casereports.bmj.com/rss/current.xml",
  "The Lancet": "https://www.thelancet.com/rssfeed/lancet/current.xml",
  "NEJM": "https://www.nejm.org/rss.xml",
};

// Simple In-Memory Cache
let cachedHeadlines = null;
let lastFetchTime = 0;
const CACHE_DURATION = 3600000; // 1 Hour

function deduplicate(headlines) {
  const seen = new Set();
  return headlines.filter(h => {
    if (seen.has(h.title)) return false;
    seen.add(h.title);
    return true;
  });
}

export default async function handler(req, res) {
  const currentTime = Date.now();

  // Return Cache if valid
  if (cachedHeadlines && (currentTime - lastFetchTime < CACHE_DURATION)) {
    return res.status(200).json({ headlines: cachedHeadlines });
  }

  try {
    const results = await Promise.all(
      Object.entries(sources).map(async ([source, url]) => {
        try {
          const feed = await parser.parseURL(url);
          return feed.items.slice(0, 3).map(item => ({
            id: item.guid || Math.random().toString(36).substr(2, 9),
            source,
            title: item.title,
            url: item.link,
            date: item.pubDate
          }));
        } catch (e) {
          console.error(`[Header Triage] Source ${source} failed.`);
          return [];
        }
      })
    );

    let headlines = deduplicate(results.flat());

    // If all feeds failed, use fallbacks
    if (headlines.length === 0) {
      headlines = FALLBACK_HEADLINES;
    }

    // Update Cache
    cachedHeadlines = headlines;
    lastFetchTime = currentTime;

    res.status(200).json({ headlines });
  } catch (err) {
    // Ultimate hard-fallback to prevent 500
    res.status(200).json({ headlines: FALLBACK_HEADLINES });
  }
}