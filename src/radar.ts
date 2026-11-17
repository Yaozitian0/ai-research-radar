/**
 * ai-research-radar: daily AI research radar across five domains
 * (LLM/Agent, RL, RAG/NLP, Multimodal/CV, AI general).
 *
 * Zero-cost pipeline: rule-based scoring + template summaries, no LLM and no
 * paid APIs. Sources: arXiv (cs.AI/cs.CL/cs.LG/cs.CV/cs.IR), GitHub
 * trending/new repos, HF daily papers + trending models, research-institution
 * RSS, Hacker News. Papers/code/models are deduped and merged by arXiv id and
 * repository URL. Outputs dated Markdown + JSON under digests/, plus
 * highlights.json for the Feishu push.
 *
 * Env vars (all optional):
 *   GITHUB_TOKEN — raises GitHub search rate limits (auto-provided in CI)
 */

import { fetchArxivData } from "./arxiv.ts";
import { fetchHfData, fetchHfPapers } from "./hf.ts";
import { fetchTrendingData } from "./trending.ts";
import { fetchHnData } from "./hn.ts";
import { loadRadarConfig } from "./config.ts";
import { toCstDateStr, toUtcStr } from "./date.ts";
import { saveFile } from "./report.ts";
import { mergeItems } from "./radar/merge.ts";
import { fetchAllRss } from "./radar/rss.ts";
import { scoreItem, compareItems, selectPicks } from "./radar/score.ts";
import { renderPicksReport, renderDomainReport, buildRadarJson, buildHighlights } from "./radar/render.ts";
import type { RadarItem, SourceStatus, DomainId } from "./radar/types.ts";
import { DOMAIN_IDS } from "./radar/types.ts";

async function main(): Promise<void> {
  const config = loadRadarConfig();
  const now = new Date();
  const dateStr = toCstDateStr(now);
  const utcStr = toUtcStr(now);
  console.log(`[${now.toISOString()}] AI research radar | date (CST): ${dateStr} | rule-based, no LLM`);

  // 1. Fetch every source in parallel; each failure degrades to empty data.
  const [arxiv, hfPapers, hfModels, trending, hn, rss] = await Promise.all([
    fetchArxivData(config.arxivCategories).catch((err) => {
      console.error(`  [arxiv] failed: ${err}`);
      return { papers: [], fetchSuccess: false };
    }),
    fetchHfPapers().catch((err) => {
      console.error(`  [hf-papers] failed: ${err}`);
      return { papers: [], fetchSuccess: false };
    }),
    fetchHfData().catch((err) => {
      console.error(`  [hf-models] failed: ${err}`);
      return { models: [], fetchSuccess: false };
    }),
    fetchTrendingData().catch((err) => {
      console.error(`  [github] failed: ${err}`);
      return { trendingRepos: [], searchRepos: [], trendingFetchSuccess: false };
    }),
    fetchHnData().catch((err) => {
      console.error(`  [hn] failed: ${err}`);
      return { stories: [], fetchSuccess: false };
    }),
    fetchAllRss(config.rssFeeds).catch((err) => {
      console.error(`  [rss] failed: ${err}`);
      return [];
    }),
  ]);

  const status: SourceStatus[] = [
    { name: "arXiv", ok: arxiv.fetchSuccess, count: arxiv.papers.length },
    { name: "HF Papers", ok: hfPapers.fetchSuccess, count: hfPapers.papers.length },
    { name: "HF Models", ok: hfModels.fetchSuccess, count: hfModels.models.length },
    {
      name: "GitHub trending/search/new",
      ok: trending.trendingFetchSuccess || trending.searchRepos.length > 0,
      count: trending.trendingRepos.length + trending.searchRepos.length,
    },
    { name: "Hacker News", ok: hn.fetchSuccess, count: hn.stories.length },
    { name: "Institution RSS", ok: rss.length > 0, count: rss.length },
  ];
  for (const s of status)
    console.log(`  [source] ${s.name}: ${s.count} items (${s.ok ? "ok" : "FAILED/empty"})`);

  if (status.every((s) => !s.ok)) {
    throw new Error("All sources failed — refusing to publish an empty digest. Re-run the workflow later.");
  }

  // 2. Merge + dedup (arXiv id / repo URL), then score every item.
  const merged = mergeItems({
    arxivPapers: arxiv.papers,
    hfPapers: hfPapers.papers,
    hfModels: hfModels.models,
    trending,
    hnStories: hn.stories,
    rssItems: rss,
  });
  const items: RadarItem[] = merged.map(scoreItem).sort(compareItems);
  console.log(`  [merge] ${items.length} unique items after dedup/merge`);

  // 3. Daily picks (10–15) with soft domain diversity.
  const picks = selectPicks(items, config.pickCount);
  console.log(`  [picks] ${picks.length} selected: ${picks.map((p) => `${p.key}(${p.total})`).join(", ")}`);

  // 4. Render + save dated archives (md + json) and Feishu highlights.
  console.log(
    `  Saved ${saveFile(renderPicksReport(dateStr, utcStr, picks, items.length, status), dateStr, "radar-picks.md")}`,
  );

  for (const domain of DOMAIN_IDS) {
    const domainItems = items.filter((it) => it.domains.includes(domain));
    const reportId = `radar-${domain}`;
    console.log(
      `  Saved ${saveFile(renderDomainReport(domain, dateStr, utcStr, domainItems, status), dateStr, `${reportId}.md`)}`,
    );
  }

  console.log(
    `  Saved ${saveFile(buildRadarJson(dateStr, utcStr, items, picks, status), dateStr, "radar.json")}`,
  );
  console.log(
    `  Saved ${saveFile(JSON.stringify(buildHighlights(picks), null, 2), dateStr, "highlights.json")}`,
  );

  const domainCounts = DOMAIN_IDS.map(
    (d: DomainId) => `${d}: ${items.filter((it) => it.primaryDomain === d).length}`,
  ).join(", ");
  console.log(`  [domains] primary counts — ${domainCounts}`);
  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
