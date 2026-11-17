/**
 * Shared types for the AI research radar pipeline.
 *
 * The radar is fully rule-based: no LLM calls, no paid APIs. Summaries are
 * template-generated from structured fields and the original English text of
 * each source (abstracts / descriptions are never machine-translated).
 */

export type DomainId = "llm-agent" | "rl" | "rag-nlp" | "multimodal-cv" | "ai-general";

export const DOMAIN_IDS: DomainId[] = ["llm-agent", "rl", "rag-nlp", "multimodal-cv", "ai-general"];

export type ItemKind = "paper" | "repo" | "model" | "article";

/** Rule-based score components. Each component is capped; total max is 100. */
export interface ScoreBreakdown {
  /** Topical relevance to the five tracked domains (0–25). */
  relevance: number;
  /** Verifiable innovation evidence: venue acceptance, claimed results (0–20). */
  innovationEvidence: number;
  /** Code and model-weight availability (0–25). */
  codeWeights: number;
  /** Source credibility and community signal (0–15). */
  credibility: number;
  /** Reproducibility: code + weights + experiments/datasets (0–15). */
  reproducibility: number;
}

export interface RadarItem {
  /** Dedup key: arxiv:<id> | repo:<owner/name> | hf:<model id> | url:<normalized url>. */
  key: string;
  kind: ItemKind;
  title: string;
  /** Original English text (abstract / description / feed summary). Never translated. */
  text: string;
  url: string;
  arxivId?: string;
  /** Normalized https://github.com/owner/repo URL (no trailing slash, no .git). */
  repoUrl?: string;
  hfModelId?: string;
  authors?: string[];
  publishedAt?: string;
  /** arXiv categories or source topic tags. */
  categories: string[];
  /** Contributing sources, e.g. "arxiv", "hf-papers", "github-trending", "hn", "rss:OpenAI". */
  sources: string[];
  /** arXiv comment field (often carries venue acceptance / code links). */
  comment?: string;
  stars?: number;
  todayStars?: number;
  downloads?: number;
  likes?: number;
  hfPaperUpvotes?: number;
  hnPoints?: number;
  hnComments?: number;
  hnUrl?: string;
  codeUrl?: string;
  weightsUrl?: string;
  projectUrl?: string;
  /** Detected venue acceptance (e.g. "NeurIPS 2026"), from the arXiv comment. */
  venue?: string;
  domains: DomainId[];
  primaryDomain: DomainId;
  /** Availability / verification flags, e.g. "no-code", "claims-unverified". */
  flags: string[];
  score: ScoreBreakdown;
  total: number;
}

export interface SourceStatus {
  name: string;
  ok: boolean;
  count: number;
}

export interface RadarConfig {
  pickCount: number;
  arxivCategories: string[];
  rssFeeds: { name: string; url: string }[];
}
