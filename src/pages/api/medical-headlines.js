// pages/api/medical-headlines.js
import Parser from 'rss-parser';

const parser = new Parser();

const sources = {
  // Retained and Verified Sources
  "Makerere University Research": "https://news.mak.ac.ug/category/research/feed/",
  "Africa CDC": "https://africacdc.org/feed/",
  "WHO Africa": "https://www.afro.who.int/rss.xml",
  "East African Medical Journal": "https://www.ajol.info/index.php/eamj/gateway/plugin/WebFeedGatewayPlugin/rss2",
  "BMJ": "https://www.bmj.com/rss/recent.xml",
  "BMJ Case Reports": "https://casereports.bmj.com/rss/current.xml",
  "BMJ Global Health": "https://gh.bmj.com/rss/current.xml",
  "BMJ Open": "https://bmjopen.bmj.com/rss/current.xml",
  "JAMA": "https://jamanetwork.com/rss/site_1/0.xml",
  "JAMA Pediatrics": "https://jamanetwork.com/rss/site_10/0.xml",
  "JAMA Oncology": "https://jamanetwork.com/rss/site_20/0.xml",
  "The Lancet": "https://www.thelancet.com/rssfeed/lancet/current.xml",
  "Lancet Infectious Diseases": "https://www.thelancet.com/rssfeed/lancetinfectdis/current.xml",
  "Lancet Global Health": "https://www.thelancet.com/rssfeed/langlo/current.xml",
  "NEJM": "https://www.nejm.org/rss.xml",
  "PLOS Medicine": "https://journals.plos.org/plosmedicine/feed/rss",
  "PLOS Global Public Health": "https://journals.plos.org/globalpublichealth/feed/rss",
  "Nature Medicine": "https://www.nature.com/nm/current_issue/rss",
  "Nature Reviews Drug Discovery": "https://www.nature.com/nrd.rss",
  "Nature Reviews Immunology": "https://www.nature.com/nri.rss",
  "Nature Reviews Microbiology": "https://www.nature.com/nrmicro.rss",
  "Nature Biotechnology": "https://www.nature.com/nbt.rss",
  "Nature Cancer": "https://www.nature.com/natcancer.rss",
  "eLife": "https://elifesciences.org/rss/current.xml",
  "Frontiers in Medicine": "https://www.frontiersin.org/journals/medicine/rss",
  "BMC Medicine": "https://bmcmedicine.biomedcentral.com/articles/rss",
  "BMC Public Health": "https://bmcpublichealth.biomedcentral.com/articles/rss",
  "BMC Infectious Diseases": "https://bmcinfectdis.biomedcentral.com/articles/rss",
  "Journal of Medical Case Reports": "https://jmedicalcasereports.biomedcentral.com/articles/rss",
  "Orphanet Journal of Rare Diseases": "https://ojrd.biomedcentral.com/articles/rss",
  "Annals of Internal Medicine": "https://www.acpjournals.org/action/showFeed?type=etoc&feed=rss&jc=aim",
  "Clinical Pharmacology & Therapeutics": "https://ascpt.onlinelibrary.wiley.com/feed/15326535/earlyview",
  "Critical Care": "https://ccforum.biomedcentral.com/articles/rss",
  "MDPI IJERPH": "https://www.mdpi.com/journal/ijerph/rss",
  "American Journal of Epidemiology": "https://academic.oup.com/aje/issue/rss",
  "JCI Insight": "https://insight.jci.org/rss",
  "Translational Medicine Comms": "https://transmedcomms.biomedcentral.com/articles/rss",
  "ScienceDaily Health": "https://www.sciencedaily.com/rss/health_medicine.xml",
  "PubMed Clinical Trials": "https://pubmed.ncbi.nlm.nih.gov/rss/search/clinicaltrials",
  "Medscape": "https://www.medscape.com/rss/public",
  "Medical News Today": "https://www.medicalnewstoday.com/rss",
  "WebMD": "https://www.webmd.com/rss/news_breaking.xml",
  "Healthline": "https://www.healthline.com/rss",
  "CDC Global Health": "https://tools.cdc.gov/api/v2/resources/media/404952.rss",
  "CDC Newsroom": "https://tools.cdc.gov/api/v2/resources/media/403372.rss",
  "WHO Global": "https://www.who.int/feeds/entity/mediacentre/news/en/rss.xml",
  "Reuters Health": "http://feeds.reuters.com/reuters/healthNews",
  "CIDRAP": "https://www.cidrap.umn.edu/rss.xml",
  "STAT News": "https://www.statnews.com/feed/",
  "News-Medical.net": "https://www.news-medical.net/rss.aspx",
  "MedPage Today": "https://www.medpagetoday.com/rss.xml",
  "Mayo Clinic": "https://newsnetwork.mayoclinic.org/feed/",
  "BBC Health": "http://feeds.bbci.co.uk/news/health/rss.xml",
  "CNN Health": "http://rss.cnn.com/rss/cnn_health.rss",

  // Removed Source
  // "Uganda Ministry of Health": "https://www.health.go.ug/rss" (Unconfirmed accessibility, potentially inactive or region-restricted)

  // New Sources Added
  "The New England Journal of Medicine Catalyst": "https://catalyst.nejm.org/rss.xml",
  "American Journal of Public Health": "https://ajph.aphapublications.org/action/showFeed?type=etoc&feed=rss",
  "Health Affairs": "https://www.healthaffairs.org/action/showFeed?type=etoc&feed=rss",
  "Journal of Global Health": "https://jogh.org/rss",
  "Emerging Infectious Diseases (CDC)": "https://wwwnc.cdc.gov/eid/rss/ahead-of-print.xml",
  "European Journal of Public Health": "https://academic.oup.com/eurpub/issue/rss",
  "The BMJ Quality & Safety": "https://qualitysafety.bmj.com/rss/current.xml",
  "Journal of Infectious Diseases": "https://academic.oup.com/jid/issue/rss",
  "American Academy of Pediatrics": "https://publications.aap.org/rss",
  "Global Health: Science and Practice": "https://www.ghspjournal.org/rss.xml",
  "Morbidity and Mortality Weekly Report (MMWR)": "https://www.cdc.gov/mmwr/mmwr_rr.xml",
  "The Conversation Health": "https://theconversation.com/africa/topics/health-17/articles.atom",
  "Kaiser Health News": "https://kffhealthnews.org/feed/",
  "British Journal of General Practice": "https://bjgp.org/rss.xml",
  "Canadian Medical Association Journal (CMAJ)": "https://www.cmaj.ca/rss/recent.xml",
  "Journal of Medical Ethics": "https://jme.bmj.com/rss/current.xml",
  "Global Health Action": "https://www.tandfonline.com/action/showFeed?type=etoc&feed=rss&jc=zgla20",
  "The Lancet Public Health": "https://www.thelancet.com/rssfeed/lanpub/current.xml",
  "Bulletin of the World Health Organization": "https://www.who.int/feeds/entity/bulletin/en/rss.xml",
  "American Journal of Tropical Medicine and Hygiene": "https://www.ajtmh.org/rss",
  "Infectious Diseases of Poverty": "https://idpjournal.biomedcentral.com/articles/rss",
  "Journal of Epidemiology and Community Health": "https://jech.bmj.com/rss/current.xml",
  "Medical Research Council (UK)": "https://mrc.ukri.org/rss.xml",
  "National Institutes of Health (NIH) News": "https://www.nih.gov/news-events/news-releases/feed",
  "The Guardian Health": "https://www.theguardian.com/society/health/rss"
};

// Updated handler function remains the same as provided
function deduplicate(headlines) {
  const seen = new Set();
  return headlines.filter(h => {
    if (seen.has(h.title)) return false;
    seen.add(h.title);
    return true;
  });
}

export default async function handler(req, res) {
  const count = Math.max(1, Math.min(parseInt(req.query.count) || 5, 20));
  let headlines = [];
  let hadAtLeastOneFeed = false;

  const results = await Promise.all(
    Object.entries(sources).map(async ([source, url]) => {
      try {
        const feed = await parser.parseURL(url);
        hadAtLeastOneFeed = true;
        return feed.items.slice(0, count).map(item => ({
          source,
          title: item.title,
          url: item.link,
          date: item.pubDate
        }));
      } catch {
        return [];
      }
    })
  );

  headlines = deduplicate(results.flat());

  if (!hadAtLeastOneFeed) {
    res.status(500).json({ error: "Failed to fetch any sources. Please try again later." });
    return;
  }

  res.status(200).json({ headlines });
}