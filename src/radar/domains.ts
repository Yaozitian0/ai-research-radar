/**
 * Rule-based domain classification for the five tracked research areas.
 *
 * Each domain has a keyword list matched against the title (weight 3), the
 * body text (weight 1) and arXiv categories / topic tags (weight 2). An item
 * can belong to several domains; the highest-scoring one is its primary.
 * Items with no keyword hit fall back to "ai-general" — every source feeding
 * the radar is AI-filtered upstream.
 */

import type { DomainId } from "./types.ts";
import { DOMAIN_IDS } from "./types.ts";

export const DOMAIN_LABELS: Record<DomainId, { zh: string; en: string }> = {
  "llm-agent": { zh: "LLM/Agent", en: "LLM/Agent" },
  rl: { zh: "强化学习 RL", en: "Reinforcement Learning" },
  "rag-nlp": { zh: "RAG/NLP", en: "RAG/NLP" },
  "multimodal-cv": { zh: "多模态/CV", en: "Multimodal/CV" },
  "ai-general": { zh: "AI 全领域", en: "AI General" },
};

const DOMAIN_KEYWORDS: Record<DomainId, RegExp[]> = {
  "llm-agent": [
    /\bllms?\b/i,
    /large language model/i,
    /language model/i,
    /\bagents?\b/i,
    /agentic/i,
    /tool[- ]use/i,
    /instruction tuning/i,
    /\brlhf\b/i,
    /chain[- ]of[- ]thought/i,
    /\bcot\b/i,
    /reasoning/i,
    /prompt(ing|s)?\b/i,
    /chatbot/i,
    /code generation/i,
    /in[- ]context learning/i,
    /fine[- ]tun/i,
    /alignment/i,
    /hallucination/i,
    /foundation model/i,
    /\bgpt\b/i,
    /\bclaude\b/i,
    /\bgemini\b/i,
    /\bllama\b/i,
    /\bqwen\b/i,
    /\bmistral\b/i,
    /\bdeepseek\b/i,
    /transformer/i,
    /mixture[- ]of[- ]experts/i,
    /\bmoe\b/i,
  ],
  rl: [
    /reinforcement learning/i,
    /\brl\b/i,
    /policy (optimization|gradient|learning|iteration)/i,
    /\bppo\b/i,
    /\bgrpo\b/i,
    /\bdpo\b/i,
    /reward (model|learning|shaping|function)/i,
    /bandit/i,
    /offline rl/i,
    /actor[- ]critic/i,
    /q[- ]learning/i,
    /markov decision/i,
    /\bmdp\b/i,
    /imitation learning/i,
    /robot learning/i,
    /exploration[- ]exploitation/i,
    /preference optimization/i,
  ],
  "rag-nlp": [
    /\brag\b/i,
    /retrieval[- ]augmented/i,
    /retriev(al|er|e)/i,
    /question answering/i,
    /\bnlp\b/i,
    /natural language/i,
    /machine translation/i,
    /summarization/i,
    /information retrieval/i,
    /search (engine|ranking)/i,
    /(text|sentence|passage|document) embedding/i,
    /embedding (model|space|search|retrieval)/i,
    /vector (database|store|search|index)/i,
    /semantic search/i,
    /named entity/i,
    /sentiment analysis/i,
    /dialogue/i,
    /text (classification|generation|mining|matching)/i,
    /tokeniz/i,
    /corpus/i,
    /document (understanding|retrieval|ranking)/i,
    /knowledge graph/i,
    /rerank/i,
  ],
  "multimodal-cv": [
    /multimodal/i,
    /multi[- ]modal/i,
    /computer vision/i,
    /\bvision\b/i,
    /image/i,
    /video/i,
    /diffusion/i,
    /segmentation/i,
    /object detection/i,
    /\b3d\b/i,
    /point cloud/i,
    /speech/i,
    /audio/i,
    /\bvlm\b/i,
    /visual/i,
    /text[- ]to[- ](image|video|3d)/i,
    /\bocr\b/i,
    /pose estimation/i,
    /\bnerf\b/i,
    /gaussian splatting/i,
    /depth estimation/i,
    /action recognition/i,
    /visual (question|grounding|reasoning)/i,
  ],
  "ai-general": [
    /machine learning/i,
    /deep learning/i,
    /neural network/i,
    /\bai\b/i,
    /artificial intelligence/i,
    /benchmark/i,
    /dataset/i,
    /interpretability/i,
    /federated/i,
    /graph neural/i,
    /time series/i,
    /automl/i,
    /quantization/i,
    /distillation/i,
    /pruning/i,
    /inference (engine|serving|optimization)/i,
    /training (efficiency|framework|at scale)/i,
    /optimization/i,
    /safety/i,
    /watermark/i,
    /privacy/i,
    /continual learning/i,
    /self[- ]supervised/i,
    /contrastive learning/i,
  ],
};

/** arXiv category → domain base hits. */
const CATEGORY_DOMAINS: Record<string, DomainId[]> = {
  "cs.CL": ["llm-agent", "rag-nlp"],
  "cs.CV": ["multimodal-cv"],
  "cs.IR": ["rag-nlp"],
  "cs.AI": ["ai-general"],
  "cs.LG": ["ai-general"],
  "stat.ML": ["ai-general"],
  "cs.RO": ["rl", "multimodal-cv"],
  "eess.AS": ["multimodal-cv"],
  "eess.IV": ["multimodal-cv"],
};

/** Broad AI filter for GitHub trending (which is not AI-specific). */
export const AI_REPO_KEYWORDS: RegExp[] = [
  /\bai\b/i,
  /artificial intelligence/i,
  /machine learning/i,
  /deep learning/i,
  /neural/i,
  /\bllm/i,
  /language model/i,
  /\brag\b/i,
  /retrieval[- ]augmented/i,
  /\bagent/i,
  /transformer/i,
  /diffusion/i,
  /multimodal/i,
  /computer vision/i,
  /reinforcement/i,
  /embedding/i,
  /inference/i,
  /fine[- ]tun/i,
  /\bgpt\b/i,
  /chatbot/i,
  /generative/i,
  /\bml\b/i,
  /\bnlp\b/i,
  /stable diffusion/i,
  /text[- ]to[- ](image|video|speech)/i,
  /vector (database|search)/i,
  /model (training|serving|context)/i,
  /\bmcp\b/i,
  /copilot/i,
  /ollama/i,
  /vllm/i,
  /pytorch/i,
  /tensorflow/i,
  /hugging ?face/i,
];

export function isAiRepoText(name: string, description: string): boolean {
  const text = `${name} ${description}`;
  return AI_REPO_KEYWORDS.some((re) => re.test(text));
}

function countHits(text: string, patterns: RegExp[]): number {
  let hits = 0;
  for (const re of patterns) if (re.test(text)) hits++;
  return hits;
}

export interface Classification {
  domains: DomainId[];
  primaryDomain: DomainId;
}

/**
 * Classify an item into the five domains. `categories` are arXiv categories
 * or GitHub topic tags. Deterministic: ties break by DOMAIN_IDS order.
 */
export function classify(title: string, text: string, categories: string[] = []): Classification {
  const scores = new Map<DomainId, number>();
  for (const d of DOMAIN_IDS) scores.set(d, 0);

  for (const d of DOMAIN_IDS) {
    const kws = DOMAIN_KEYWORDS[d];
    const s = 3 * countHits(title, kws) + Math.min(countHits(text, kws), 8);
    scores.set(d, s);
  }
  for (const cat of categories) {
    for (const d of CATEGORY_DOMAINS[cat] ?? []) {
      scores.set(d, (scores.get(d) ?? 0) + 2);
    }
  }

  const ranked = DOMAIN_IDS.filter((d) => (scores.get(d) ?? 0) > 0).sort(
    (a, b) => (scores.get(b) ?? 0) - (scores.get(a) ?? 0) || DOMAIN_IDS.indexOf(a) - DOMAIN_IDS.indexOf(b),
  );

  if (ranked.length === 0) return { domains: ["ai-general"], primaryDomain: "ai-general" };
  return { domains: ranked, primaryDomain: ranked[0]! };
}
