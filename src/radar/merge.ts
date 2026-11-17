/**
 * Normalization, dedup and cross-source merging.
 *
 * Papers are keyed by bare arXiv id (version stripped), repos by normalized
 * GitHub URL, HF models by model id. A paper that links a repo absorbs the
 * repo's trending/search/HN signals; a model whose card tags an arXiv id is
 * merged into that paper as its weights release. HN stories pointing at an
 * arXiv page or a GitHub repo merge into the corresponding item.
 */

import type { ArxivPaper } from "../arxiv.ts";
import type { HfModel, HfPaper } from "../hf.ts";
import type { TrendingData } from "../trending.ts";
import type { HnStory } from "../hn.ts";
import type { RadarItem } from "./types.ts";
import { isAiRepoText } from "./domains.ts";

export interface RssItem {
  feedName: string;
  title: string;
  url: string;
  text: string;
  publishedAt: string;
}

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

/** "http://arxiv.org/abs/2501.01234v2" → "2501.01234". Returns null if not arXiv. */
export function normalizeArxivId(urlOrId: string): string | null {
  const s = urlOrId.trim();
  const m = s.match(/arxiv\.org\/(?:abs|pdf|html)\/([^\s?#]+?)(?:v\d+)?(?:\.pdf)?\/?$/i);
  const raw = m ? m[1]! : /^\d{4}\.\d{4,5}(v\d+)?$/.test(s) ? s : null;
  if (!raw) return null;
  return raw.replace(/v\d+$/, "");
}

const GITHUB_NON_REPO_OWNERS = new Set([
  "sponsors",
  "topics",
  "collections",
  "events",
  "about",
  "pricing",
  "features",
  "enterprise",
  "team",
  "settings",
  "notifications",
  "explore",
  "marketplace",
  "pulls",
  "issues",
  "codespaces",
  "security",
  "customer-stories",
  "readme",
  "login",
  "join",
  "new",
  "organizations",
  "dashboard",
  "stars",
  "watching",
  "account",
  "apps",
  "users",
  "orgs",
  "sessions",
  "signup",
  "site",
  "mobile",
  "git-lfs",
  "community",
  "trending",
  "search",
  "blog",
  "contact",
  "premium-support",
  "edu",
  "careers",
  "press",
  "shop",
  "trust",
  "legal",
  "status",
]);

/** Normalize any github.com repo URL to https://github.com/owner/repo (null if not a repo URL). */
export function normalizeRepoUrl(url: string): string | null {
  const m = url.match(/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/i);
  if (!m) return null;
  const owner = m[1]!;
  const name = m[2]!.replace(/\.git$/, "").replace(/[.,;:]+$/, "");
  if (!name) return null;
  if (GITHUB_NON_REPO_OWNERS.has(owner.toLowerCase())) return null;
  // github.com/<owner>/issues etc. are reserved paths, not repositories.
  const reservedNames = [
    "issues",
    "pulls",
    "wiki",
    "releases",
    "actions",
    "projects",
    "security",
    "pulse",
    "graphs",
  ];
  if (reservedNames.includes(name.toLowerCase())) return null;
  return `https://github.com/${owner}/${name}`;
}

/** Extract candidate repo URLs from free text (abstracts, comments, descriptions). */
export function extractGithubUrls(text: string): string[] {
  const out: string[] = [];
  const re = /https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const norm = normalizeRepoUrl(m[0]);
    if (norm && !out.includes(norm)) out.push(norm);
  }
  return out;
}

export function repoKey(repoUrl: string): string {
  return `repo:${repoUrl.replace("https://github.com/", "").toLowerCase()}`;
}

function normalizeArticleUrl(url: string): string {
  return url
    .trim()
    .replace(/\/+$/, "")
    .replace(/^http:\/\//i, "https://")
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Item builders
// ---------------------------------------------------------------------------

function baseItem(
  partial: Partial<RadarItem> & Pick<RadarItem, "key" | "kind" | "title" | "url">,
): RadarItem {
  return {
    text: "",
    categories: [],
    sources: [],
    domains: [],
    primaryDomain: "ai-general",
    flags: [],
    score: { relevance: 0, innovationEvidence: 0, codeWeights: 0, credibility: 0, reproducibility: 0 },
    total: 0,
    ...partial,
  };
}

function addSource(item: RadarItem, source: string): void {
  if (!item.sources.includes(source)) item.sources.push(source);
}

function detectVenue(comment: string): string | undefined {
  if (!/accepted|to appear|camera[- ]ready/i.test(comment)) return undefined;
  const m = comment.match(
    /\b(neurips|nips|icml|iclr|acl|emnlp|naacl|cvpr|iccv|eccv|aaai|ijcai|kdd|sigir|coling|eacl|tmlr|jmlr|www|wsdm|cikm|interspeech|icassp)\b[^\n.,;]*/i,
  );
  if (!m) return "acceptance noted in arXiv comment (venue not parsed)";
  const raw = m[0].trim();
  if (raw.length <= 60) return raw;
  const cut = raw.slice(0, 60);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > 20 ? cut.slice(0, lastSpace) : cut;
}

// ---------------------------------------------------------------------------
// Merge pipeline
// ---------------------------------------------------------------------------

export interface MergeInputs {
  arxivPapers: ArxivPaper[];
  hfPapers: HfPaper[];
  hfModels: HfModel[];
  trending: TrendingData;
  hnStories: HnStory[];
  rssItems: RssItem[];
}

export function mergeItems(inputs: MergeInputs): RadarItem[] {
  const items = new Map<string, RadarItem>();
  const byArxiv = new Map<string, RadarItem>();
  const byRepo = new Map<string, RadarItem>();
  const absorbed = new Set<string>();

  const upsert = (item: RadarItem): RadarItem => {
    const existing = items.get(item.key);
    if (existing) return existing;
    items.set(item.key, item);
    return item;
  };

  // 1. arXiv papers -----------------------------------------------------------
  for (const p of inputs.arxivPapers) {
    const arxivId = normalizeArxivId(p.id) ?? p.id;
    const item = upsert(
      baseItem({
        key: `arxiv:${arxivId}`,
        kind: "paper",
        title: p.title,
        text: p.summary,
        url: `https://arxiv.org/abs/${arxivId}`,
        arxivId,
        authors: p.authors,
        publishedAt: p.published,
        categories: p.categories,
        comment: p.comment,
        venue: p.comment ? detectVenue(p.comment) : undefined,
        sources: ["arxiv"],
      }),
    );
    byArxiv.set(arxivId, item);
  }

  // 2. HF daily papers — merge into arXiv items by id -------------------------
  for (const p of inputs.hfPapers) {
    const arxivId = normalizeArxivId(p.arxivId) ?? p.arxivId;
    let item = byArxiv.get(arxivId);
    if (!item) {
      item = upsert(
        baseItem({
          key: `arxiv:${arxivId}`,
          kind: "paper",
          title: p.title,
          text: p.summary,
          url: `https://arxiv.org/abs/${arxivId}`,
          arxivId,
          authors: p.authors,
          publishedAt: p.publishedAt,
          categories: [],
          sources: ["hf-papers"],
        }),
      );
      byArxiv.set(arxivId, item);
    } else {
      addSource(item, "hf-papers");
      if (!item.text && p.summary) item.text = p.summary;
    }
    item.hfPaperUpvotes = Math.max(item.hfPaperUpvotes ?? 0, p.upvotes);
    if (p.githubRepo) {
      const norm = normalizeRepoUrl(
        p.githubRepo.startsWith("http") ? p.githubRepo : `https://github.com/${p.githubRepo}`,
      );
      if (norm) item.codeUrl = item.codeUrl ?? norm;
    }
    if (p.projectPage) item.projectUrl = item.projectUrl ?? p.projectPage;
  }

  // 3. GitHub trending + search (active and new repos) ------------------------
  for (const r of inputs.trending.trendingRepos) {
    if (!isAiRepoText(r.fullName, r.description)) continue;
    const url = normalizeRepoUrl(r.url) ?? r.url;
    const item = upsert(
      baseItem({
        key: repoKey(url),
        kind: "repo",
        title: r.fullName,
        text: r.description,
        url,
        repoUrl: url,
        stars: r.totalStars,
        todayStars: r.todayStars,
        categories: r.language ? [r.language] : [],
        sources: ["github-trending"],
      }),
    );
    item.stars = Math.max(item.stars ?? 0, r.totalStars);
    item.todayStars = Math.max(item.todayStars ?? 0, r.todayStars);
    addSource(item, "github-trending");
    byRepo.set(repoKey(url), item);
  }
  for (const r of inputs.trending.searchRepos) {
    if (!isAiRepoText(r.fullName, r.description ?? "")) continue;
    const url = normalizeRepoUrl(r.url) ?? r.url;
    const isNew = r.searchQuery.startsWith("new:");
    const source = isNew ? "github-new" : "github-search";
    const item = upsert(
      baseItem({
        key: repoKey(url),
        kind: "repo",
        title: r.fullName,
        text: r.description ?? "",
        url,
        repoUrl: url,
        stars: r.stargazersCount,
        publishedAt: r.pushedAt,
        categories: [r.searchQuery.replace(/^new:/, "")],
        sources: [source],
      }),
    );
    item.stars = Math.max(item.stars ?? 0, r.stargazersCount);
    addSource(item, source);
    byRepo.set(repoKey(url), item);
  }

  // 4. HF models ---------------------------------------------------------------
  const modelsByArxiv = new Map<string, HfModel[]>();
  for (const m of inputs.hfModels) {
    const arxivTag = m.tags.find((t) => t.startsWith("arxiv:"));
    const arxivId = arxivTag ? normalizeArxivId(arxivTag.slice(6)) : null;
    if (arxivId) {
      const list = modelsByArxiv.get(arxivId) ?? [];
      list.push(m);
      modelsByArxiv.set(arxivId, list);
    }
    upsert(
      baseItem({
        key: `hf:${m.id.toLowerCase()}`,
        kind: "model",
        title: m.id,
        text: `Hugging Face model · pipeline: ${m.pipelineTag || "n/a"} · tags: ${m.tags.slice(0, 12).join(", ")}`,
        url: m.url,
        hfModelId: m.id,
        likes: m.likes,
        downloads: m.downloads,
        publishedAt: m.lastModified,
        categories: m.tags.filter((t) => !t.includes(":")).slice(0, 10),
        sources: ["hf-models"],
        weightsUrl: m.url,
        arxivId: arxivId ?? undefined,
      }),
    );
  }

  // 5. HN stories — merge into paper/repo when the URL points at one ----------
  for (const s of inputs.hnStories) {
    const arxivId = normalizeArxivId(s.url);
    const repoUrl = normalizeRepoUrl(s.url);
    if (arxivId) {
      let item = byArxiv.get(arxivId);
      if (!item) {
        item = upsert(
          baseItem({
            key: `arxiv:${arxivId}`,
            kind: "paper",
            title: s.title,
            url: `https://arxiv.org/abs/${arxivId}`,
            arxivId,
            publishedAt: s.createdAt,
            sources: ["hn"],
          }),
        );
        byArxiv.set(arxivId, item);
      }
      addSource(item, "hn");
      item.hnPoints = Math.max(item.hnPoints ?? 0, s.points);
      item.hnComments = Math.max(item.hnComments ?? 0, s.comments);
      item.hnUrl = s.hnUrl;
      continue;
    }
    if (repoUrl) {
      const key = repoKey(repoUrl);
      let item = byRepo.get(key);
      if (!item) {
        item = upsert(
          baseItem({
            key,
            kind: "repo",
            title: repoUrl.replace("https://github.com/", ""),
            url: repoUrl,
            repoUrl,
            publishedAt: s.createdAt,
            sources: ["hn"],
          }),
        );
        byRepo.set(key, item);
      }
      addSource(item, "hn");
      item.hnPoints = Math.max(item.hnPoints ?? 0, s.points);
      item.hnComments = Math.max(item.hnComments ?? 0, s.comments);
      item.hnUrl = s.hnUrl;
      if (!item.text) item.text = s.title;
      continue;
    }
    upsert(
      baseItem({
        key: `url:${normalizeArticleUrl(s.url)}`,
        kind: "article",
        title: s.title,
        url: s.url,
        publishedAt: s.createdAt,
        hnPoints: s.points,
        hnComments: s.comments,
        hnUrl: s.hnUrl,
        sources: ["hn"],
      }),
    );
  }

  // 6. Institutional RSS articles ----------------------------------------------
  for (const a of inputs.rssItems) {
    const arxivId = normalizeArxivId(a.url) ?? a.text.match(/arxiv\.org\/abs\/(\d{4}\.\d{4,5})/)?.[1] ?? null;
    if (arxivId && byArxiv.has(arxivId)) {
      const item = byArxiv.get(arxivId)!;
      addSource(item, `rss:${a.feedName}`);
      continue;
    }
    const repoUrl = extractGithubUrls(a.text)[0] ?? normalizeRepoUrl(a.url);
    if (repoUrl && byRepo.has(repoKey(repoUrl))) {
      const item = byRepo.get(repoKey(repoUrl))!;
      addSource(item, `rss:${a.feedName}`);
      continue;
    }
    upsert(
      baseItem({
        key: `url:${normalizeArticleUrl(a.url)}`,
        kind: "article",
        title: a.title,
        text: a.text,
        url: a.url,
        publishedAt: a.publishedAt,
        sources: [`rss:${a.feedName}`],
      }),
    );
  }

  // 7. Cross-merge: paper ↔ repo (code), paper ↔ model (weights) ---------------
  for (const item of items.values()) {
    if (item.kind !== "paper") continue;
    const candidates = [
      ...(item.codeUrl ? [item.codeUrl] : []),
      ...extractGithubUrls(`${item.text} ${item.comment ?? ""}`),
    ];
    const codeUrl = candidates[0];
    if (codeUrl) {
      item.codeUrl = codeUrl;
      const repoItem = byRepo.get(repoKey(codeUrl));
      if (repoItem && repoItem.key !== item.key) {
        item.stars = Math.max(item.stars ?? 0, repoItem.stars ?? 0);
        item.todayStars = Math.max(item.todayStars ?? 0, repoItem.todayStars ?? 0);
        item.hnPoints = Math.max(item.hnPoints ?? 0, repoItem.hnPoints ?? 0);
        item.hnUrl = item.hnUrl ?? repoItem.hnUrl;
        for (const src of repoItem.sources) addSource(item, src);
        absorbed.add(repoItem.key);
      }
    }
    const models = item.arxivId ? modelsByArxiv.get(item.arxivId) : undefined;
    if (models?.length) {
      const best = models.sort((a, b) => b.likes - a.likes)[0]!;
      item.weightsUrl = best.url;
      item.likes = Math.max(item.likes ?? 0, best.likes);
      item.downloads = Math.max(item.downloads ?? 0, best.downloads);
      addSource(item, "hf-models");
      for (const m of models) absorbed.add(`hf:${m.id.toLowerCase()}`);
    }
  }

  return [...items.values()].filter((it) => !absorbed.has(it.key));
}
