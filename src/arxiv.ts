/**
 * ArXiv AI papers fetched via the ArXiv API (Atom feed).
 *
 * Strategy: query the configured categories (default cs.AI + cs.CL + cs.LG +
 * cs.CV + cs.IR) for the newest papers, sorted by submission date, filtered
 * to last 48h.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  updated: string;
  categories: string[];
  url: string;
  pdfUrl: string;
  /** arXiv comment field — often carries venue acceptance and code links. */
  comment: string;
}

export interface ArxivData {
  papers: ArxivPaper[];
  fetchSuccess: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ARXIV_MAX_RESULTS = 100;
const API_URL = "https://export.arxiv.org/api/query";

/** Default arXiv categories to search (overridable via config.yml). */
const CATEGORIES = ["cs.AI", "cs.CL", "cs.LG", "cs.CV", "cs.IR"];

/** Delay between requests (ArXiv asks for 3s; 4s leaves headroom). */
const REQUEST_DELAY_MS = 4000;
/** On HTTP 429, wait this long before retrying (ArXiv throttles bursts). */
const RETRY_429_DELAY_MS = 15000;
const MAX_429_RETRIES = 2;

// ---------------------------------------------------------------------------
// XML helpers (lightweight, no dependency)
// ---------------------------------------------------------------------------

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = xml.match(re);
  return m ? m[1]!.trim() : "";
}

function extractAllTags(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g");
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    results.push(m[1]!.trim());
  }
  return results;
}

function extractAttr(xml: string, tag: string, attr: string): string[] {
  const re = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*/?>`, "g");
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    results.push(m[1]!);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

function parseEntry(entryXml: string): ArxivPaper | null {
  const id = extractTag(entryXml, "id");
  if (!id) return null;

  const title = extractTag(entryXml, "title").replace(/\s+/g, " ");
  const summary = extractTag(entryXml, "summary").replace(/\s+/g, " ");
  const authors = extractAllTags(entryXml, "name");
  const published = extractTag(entryXml, "published");
  const updated = extractTag(entryXml, "updated");
  const categories = extractAttr(entryXml, "category", "term");

  const url = id; // ArXiv id IS the URL (e.g. http://arxiv.org/abs/...)
  const pdfUrl = id.replace("/abs/", "/pdf/");
  const comment = extractTag(entryXml, "arxiv:comment").replace(/\s+/g, " ");

  return { id, title, summary, authors, published, updated, categories, url, pdfUrl, comment };
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchArxivData(categories: string[] = CATEGORIES): Promise<ArxivData> {
  const seen = new Map<string, ArxivPaper>();

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i]!;
    if (i > 0) await sleep(REQUEST_DELAY_MS);

    try {
      const params = new URLSearchParams({
        search_query: `cat:${cat}`,
        sortBy: "submittedDate",
        sortOrder: "descending",
        max_results: String(ARXIV_MAX_RESULTS),
      });

      let resp: Response | null = null;
      for (let attempt = 0; attempt <= MAX_429_RETRIES; attempt++) {
        resp = await fetch(`${API_URL}?${params}`, {
          headers: { "User-Agent": "ai-research-radar/1.0" },
        });
        if (resp.status !== 429) break;
        if (attempt < MAX_429_RETRIES) {
          console.error(
            `  [arxiv] ${cat}: HTTP 429 — retry ${attempt + 1}/${MAX_429_RETRIES} in ${RETRY_429_DELAY_MS / 1000}s`,
          );
          await sleep(RETRY_429_DELAY_MS);
        }
      }

      if (!resp || !resp.ok) {
        console.error(`  [arxiv] ${cat}: HTTP ${resp?.status ?? "no response"}`);
        continue;
      }

      const xml = await resp.text();

      // Split into entries
      const entryBlocks = xml.split("<entry>").slice(1);
      for (const block of entryBlocks) {
        const paper = parseEntry("<entry>" + block);
        if (paper && !seen.has(paper.id)) {
          seen.set(paper.id, paper);
        }
      }

      console.log(`  [arxiv] ${cat}: ${entryBlocks.length} papers`);
    } catch (err) {
      console.error(`  [arxiv] ${cat}: ${err}`);
    }
  }

  // Filter to last 48h (ArXiv has a ~1-day publishing delay, so 24h would miss today's batch)
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const papers = [...seen.values()]
    .filter((p) => new Date(p.published).getTime() > cutoff)
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, ARXIV_MAX_RESULTS * categories.length);

  console.log(`  [arxiv] ${papers.length} papers (from ${seen.size} unique)`);
  return { papers, fetchSuccess: papers.length > 0 };
}
