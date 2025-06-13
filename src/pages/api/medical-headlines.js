// pages/api/medical-headlines.js
import Parser from 'rss-parser';

const parser = new Parser();

const sources = {
  PubMed: 'https://pubmed.ncbi.nlm.nih.gov/rss/search/1U4QZ2uU6DNHV0pb0Flz7RxDWFeZOWDpHLKcZRP0VZuFJOhIMX/?limit=10&utm_campaign=pubmed-2&fc=20240220154827',
  ScienceDaily: 'https://www.sciencedaily.com/rss/health_medicine.xml',
  Medscape: 'https://www.medscape.com/rss/public',
  WHO: 'https://www.who.int/feeds/entity/mediacentre/news/en/rss.xml',
  'Medical News Today': 'https://www.medicalnewstoday.com/rss',
  'Nature Medicine': 'https://www.nature.com/subjects/medicine/rss.xml'
};

export default async function handler(req, res) {
  const headlines = [];

  for (const [source, url] of Object.entries(sources)) {
    try {
      const feed = await parser.parseURL(url);
      feed.items.slice(0, 5).forEach(item => {
        headlines.push(`[${source}] ${item.title}`);
      });
    } catch (error) {
      console.error(`Failed to fetch ${source}:`, error.message);
    }
  }

  res.status(200).json({ headlines });
}