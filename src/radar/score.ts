/**
 * Deterministic rule-based scoring (no LLM). Total 0–100 across five axes:
 *
 *   relevance          0–25  keyword relevance to the tracked domains
 *   innovationEvidence 0–20  venue acceptance (+10), SOTA claims (+6), novelty claims (+4)
 *   codeWeights        0–25  code link (+15), weights link/release statement (+10)
 *   credibility        0–15  institutional source, venue, HN/stars/likes signals
 *   reproducibility    0–15  code (+6), weights (+4), experiments/datasets mentioned (+5)
 *
 * Claims found in abstracts are *claims*: they add points under
 * innovationEvidence but are always flagged "claims-unverified" unless a venue
 * acceptance was detected. The renderer never states novelty as a fact.
 */

import type { RadarItem, ScoreBreakdown } from "./types.ts";
import { classify } from "./domains.ts";

export const SCORE_MAX: ScoreBreakdown = {
  relevance: 25,
  innovationEvidence: 20,
  codeWeights: 25,
  credibility: 15,
  reproducibility: 15,
};

export const VENUE_RE =
  /accepted (at|to|by|for)|to appear (at|in)|camera[- ]ready|accepted (in|to) (the )?(findings|main|workshop)/i;
export const VENUE_NAME_RE =
  /\b(neurips|nips|icml|iclr|acl|emnlp|naacl|cvpr|iccv|eccv|aaai|ijcai|kdd|sigir|coling|eacl|tmlr|jmlr|www|wsdm|cikm|interspeech|icassp)\b/i;
export const SOTA_RE =
  /state[- ]of[- ]the[- ]art|\bsota\b|outperform|surpass(es|ed)?|superior to|significant(ly)? (improve|better|outperform)|new record/i;
export const NOVEL_RE =
  /\bnovel\b|\bfirst\b|we (propose|introduce|present)|new (method|framework|approach|architecture|benchmark|dataset|paradigm)/i;
export const EXPERIMENT_RE = /experiment|evaluat|benchmark|ablation|empirical|dataset|baseline/i;
export const WEIGHTS_TEXT_RE =
  /weights? (are |is |will be )?(released|available|public|open)|open[- ]sourc(e|ed|ing) (the )?(model|weights|checkpoints)|model (card|weights)|checkpoints? (are |is )?(released|available)|release(d)? (the )?(model|weights|checkpoints)/i;

const clamp = (v: number, max: number) => Math.max(0, Math.min(max, Math.round(v)));

function distinctHits(text: string, patterns: RegExp[]): number {
  let n = 0;
  for (const re of patterns) if (re.test(text)) n++;
  return n;
}

/** Relevance uses the same keyword families as domain classification. */
function relevanceScore(item: RadarItem): number {
  const { domains } = classify(item.title, item.text, item.categories);
  // More matched domains and denser keyword hits => more relevant.
  const titleWords = item.title.toLowerCase();
  const density = distinctHits(titleWords, [
    /\bllm|\bagent|reinforcement|retrieval|multimodal|vision|language model|diffusion|reasoning/i,
  ]);
  return clamp(6 + 4 * domains.length + 3 * density + Math.min(item.text.length > 200 ? 2 : 0, 2), 25);
}

function innovationScore(item: RadarItem): number {
  const body = `${item.text} ${item.comment ?? ""}`;
  let s = 0;
  if (item.venue) s += 10;
  if (SOTA_RE.test(body)) s += 6;
  if (NOVEL_RE.test(body)) s += 4;
  return clamp(s, SCORE_MAX.innovationEvidence);
}

function codeWeightsScore(item: RadarItem): number {
  let s = 0;
  if (item.codeUrl || item.kind === "repo") s += 15;
  if (item.weightsUrl || item.kind === "model" || WEIGHTS_TEXT_RE.test(item.text)) s += 10;
  return clamp(s, SCORE_MAX.codeWeights);
}

function credibilityScore(item: RadarItem): number {
  let s = 0;
  if (item.sources.some((src) => src.startsWith("rss:"))) s += 6;
  if (item.kind === "paper" && item.arxivId) s += 3;
  if (item.sources.includes("hf-papers")) s += 2;
  if (item.venue) s += 4;
  if (item.hnPoints !== undefined) s += Math.min(4, Math.log10(item.hnPoints + 1) * 2);
  if (item.stars !== undefined) s += Math.min(4, Math.log10(item.stars + 1) * 1.6);
  const likes = item.likes ?? item.hfPaperUpvotes ?? 0;
  if (likes > 0) s += Math.min(3, Math.log10(likes + 1) * 1.5);
  if (item.downloads !== undefined && item.downloads > 0) {
    s += Math.min(2, Math.log10(item.downloads + 1) * 0.4);
  }
  return clamp(s, SCORE_MAX.credibility);
}

function reproducibilityScore(item: RadarItem): number {
  let s = 0;
  if (item.codeUrl || item.kind === "repo") s += 6;
  if (item.weightsUrl || item.kind === "model") s += 4;
  if (EXPERIMENT_RE.test(`${item.text} ${item.comment ?? ""}`)) s += 5;
  return clamp(s, SCORE_MAX.reproducibility);
}

/**
 * Compute score breakdown, total and availability/verification flags.
 * Mutates nothing; returns a new item with classification + score filled in.
 */
export function scoreItem(item: RadarItem): RadarItem {
  const { domains, primaryDomain } = classify(item.title, item.text, item.categories);
  const scored: RadarItem = { ...item, domains, primaryDomain };

  const score: ScoreBreakdown = {
    relevance: relevanceScore(scored),
    innovationEvidence: innovationScore(scored),
    codeWeights: codeWeightsScore(scored),
    credibility: credibilityScore(scored),
    reproducibility: reproducibilityScore(scored),
  };
  const total =
    score.relevance +
    score.innovationEvidence +
    score.codeWeights +
    score.credibility +
    score.reproducibility;

  const flags: string[] = [];
  const body = `${scored.text} ${scored.comment ?? ""}`;
  if (scored.kind === "paper" && !scored.codeUrl) flags.push("no-code");
  if ((scored.kind === "paper" || scored.kind === "model") && !scored.weightsUrl) flags.push("no-weights");
  if (scored.kind === "paper" && !EXPERIMENT_RE.test(body)) flags.push("no-experiments");
  if ((SOTA_RE.test(body) || NOVEL_RE.test(body)) && !scored.venue) flags.push("claims-unverified");

  return { ...scored, score, total, flags };
}

/** Sort comparator: total desc, then recency desc, then title for stability. */
export function compareItems(a: RadarItem, b: RadarItem): number {
  if (b.total !== a.total) return b.total - a.total;
  const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
  const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
  if (tb !== ta) return tb - ta;
  return a.title.localeCompare(b.title);
}

/**
 * Pick the daily selection (10–15 items, default 12) with soft domain
 * diversity: every domain that has candidates should appear at least once.
 * Deterministic — swaps only the lowest-ranked pick from an over-represented
 * domain for the best unpicked item of a missing domain.
 */
export function selectPicks(sorted: RadarItem[], pickCount: number): RadarItem[] {
  const n = Math.max(10, Math.min(15, pickCount));
  const picks = sorted.slice(0, n);
  const pickedKeys = new Set(picks.map((p) => p.key));

  for (const domain of ["llm-agent", "rl", "rag-nlp", "multimodal-cv", "ai-general"] as const) {
    if (picks.some((p) => p.primaryDomain === domain)) continue;
    const candidate = sorted.find((it) => it.primaryDomain === domain && !pickedKeys.has(it.key));
    if (!candidate) continue;
    // Find the last pick whose primary domain is represented at least twice.
    const counts = new Map<string, number>();
    for (const p of picks) counts.set(p.primaryDomain, (counts.get(p.primaryDomain) ?? 0) + 1);
    let swapIdx = -1;
    for (let i = picks.length - 1; i >= 0; i--) {
      if ((counts.get(picks[i]!.primaryDomain) ?? 0) >= 2) {
        swapIdx = i;
        break;
      }
    }
    if (swapIdx === -1) continue;
    pickedKeys.delete(picks[swapIdx]!.key);
    picks[swapIdx] = candidate;
    pickedKeys.add(candidate.key);
  }

  return picks.sort(compareItems);
}
