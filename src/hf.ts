/**
 * Hugging Face data: trending models (Hub API) and daily papers (papers API).
 * Both endpoints are free and need no key.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HfModel {
  id: string; // e.g. "meta-llama/Llama-3.1-8B"
  author: string;
  likes: number;
  downloads: number;
  tags: string[];
  pipelineTag: string;
  lastModified: string;
  url: string;
}

export interface HfData {
  models: HfModel[];
  fetchSuccess: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HF_FETCH_LIMIT = 30;
const API_URL = "https://huggingface.co/api/models";

// ---------------------------------------------------------------------------
// Response type
// ---------------------------------------------------------------------------

interface HfApiModel {
  _id: string;
  id: string;
  author?: string;
  likes: number;
  downloads: number;
  tags?: string[];
  pipeline_tag?: string;
  lastModified?: string;
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

export async function fetchHfData(): Promise<HfData> {
  try {
    // Fetch trending models (sorted by likes, recently modified)
    const params = new URLSearchParams({
      sort: "likes7d",
      direction: "-1",
      limit: String(HF_FETCH_LIMIT),
      full: "false",
    });

    const resp = await fetch(`${API_URL}?${params}`, {
      headers: { "User-Agent": "agents-radar/1.0" },
    });

    if (!resp.ok) {
      console.error(`  [hf] HTTP ${resp.status}`);
      return { models: [], fetchSuccess: false };
    }

    const raw = (await resp.json()) as HfApiModel[];

    const models: HfModel[] = raw.map((m) => ({
      id: m.id,
      author: m.author ?? m.id.split("/")[0] ?? "unknown",
      likes: m.likes,
      downloads: m.downloads,
      tags: m.tags ?? [],
      pipelineTag: m.pipeline_tag ?? "",
      lastModified: m.lastModified ?? "",
      url: `https://huggingface.co/${m.id}`,
    }));

    console.log(`  [hf] ${models.length} trending models`);
    return { models, fetchSuccess: models.length > 0 };
  } catch (err) {
    console.error(`  [hf] fetch failed: ${err}`);
    return { models: [], fetchSuccess: false };
  }
}

// ---------------------------------------------------------------------------
// HF daily papers
// ---------------------------------------------------------------------------

export interface HfPaper {
  /** Bare arXiv id, e.g. "2501.01234". */
  arxivId: string;
  title: string;
  summary: string;
  authors: string[];
  upvotes: number;
  publishedAt: string;
  /** "owner/repo" or full URL when the community linked code. */
  githubRepo?: string;
  projectPage?: string;
}

export interface HfPapersData {
  papers: HfPaper[];
  fetchSuccess: boolean;
}

interface HfApiDailyPaper {
  paper?: {
    id?: string;
    title?: string;
    summary?: string;
    authors?: { name?: string }[];
    publishedAt?: string;
    upvotes?: number;
    githubRepo?: string;
    projectPage?: string;
  };
  publishedAt?: string;
}

const PAPERS_API_URL = "https://huggingface.co/api/daily_papers";

async function fetchPapersForDate(date?: string): Promise<HfPaper[]> {
  const params = new URLSearchParams({ limit: "100" });
  if (date) params.set("date", date);
  const resp = await fetch(`${PAPERS_API_URL}?${params}`, {
    headers: { "User-Agent": "ai-research-radar/1.0" },
  });
  if (!resp.ok) {
    console.error(`  [hf-papers] ${date ?? "today"}: HTTP ${resp.status}`);
    return [];
  }
  const raw = (await resp.json()) as HfApiDailyPaper[];
  const papers: HfPaper[] = [];
  for (const entry of Array.isArray(raw) ? raw : []) {
    const p = entry.paper;
    if (!p?.id || !p.title) continue;
    papers.push({
      arxivId: p.id,
      title: p.title.replace(/\s+/g, " ").trim(),
      summary: (p.summary ?? "").replace(/\s+/g, " ").trim(),
      authors: (p.authors ?? []).map((a) => a.name ?? "").filter(Boolean),
      upvotes: p.upvotes ?? 0,
      publishedAt: p.publishedAt ?? entry.publishedAt ?? "",
      ...(p.githubRepo ? { githubRepo: p.githubRepo } : {}),
      ...(p.projectPage ? { projectPage: p.projectPage } : {}),
    });
  }
  return papers;
}

/** Fetch today's and yesterday's daily papers (48h coverage, deduped by id). */
export async function fetchHfPapers(): Promise<HfPapersData> {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const [today, prev] = await Promise.all([fetchPapersForDate(), fetchPapersForDate(yesterday)]);
    const seen = new Map<string, HfPaper>();
    for (const p of [...today, ...prev]) {
      const existing = seen.get(p.arxivId);
      if (!existing || p.upvotes > existing.upvotes) seen.set(p.arxivId, p);
    }
    const papers = [...seen.values()];
    console.log(`  [hf-papers] ${papers.length} daily papers (today + yesterday)`);
    return { papers, fetchSuccess: papers.length > 0 };
  } catch (err) {
    console.error(`  [hf-papers] fetch failed: ${err}`);
    return { papers: [], fetchSuccess: false };
  }
}
