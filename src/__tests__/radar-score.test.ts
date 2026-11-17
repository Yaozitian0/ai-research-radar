import { describe, it, expect } from "vitest";
import { scoreItem, compareItems, selectPicks, SCORE_MAX } from "../radar/score.ts";
import type { RadarItem } from "../radar/types.ts";

function item(overrides: Partial<RadarItem> = {}): RadarItem {
  return {
    key: "arxiv:2501.00001",
    kind: "paper",
    title: "A Novel LLM Agent Framework",
    text: "We propose a novel agent framework with experiments on several benchmarks.",
    url: "https://arxiv.org/abs/2501.00001",
    arxivId: "2501.00001",
    categories: ["cs.AI", "cs.CL"],
    sources: ["arxiv"],
    domains: [],
    primaryDomain: "ai-general",
    flags: [],
    score: { relevance: 0, innovationEvidence: 0, codeWeights: 0, credibility: 0, reproducibility: 0 },
    total: 0,
    ...overrides,
  };
}

describe("scoreItem", () => {
  it("keeps every component within its cap and total ≤ 100", () => {
    const s = scoreItem(
      item({
        text: "We propose a novel state-of-the-art LLM agent. We outperform all baselines. Experiments and datasets included. Weights released.",
        comment: "Accepted at NeurIPS 2026",
        codeUrl: "https://github.com/lab/fw",
        weightsUrl: "https://huggingface.co/lab/model",
        stars: 100000,
        hnPoints: 5000,
        likes: 10000,
        downloads: 1000000,
        sources: ["arxiv", "hf-papers", "hn", "rss:OpenAI"],
        venue: "NeurIPS 2026",
      }),
    );
    expect(s.score.relevance).toBeLessThanOrEqual(SCORE_MAX.relevance);
    expect(s.score.innovationEvidence).toBeLessThanOrEqual(SCORE_MAX.innovationEvidence);
    expect(s.score.codeWeights).toBeLessThanOrEqual(SCORE_MAX.codeWeights);
    expect(s.score.credibility).toBeLessThanOrEqual(SCORE_MAX.credibility);
    expect(s.score.reproducibility).toBeLessThanOrEqual(SCORE_MAX.reproducibility);
    expect(s.total).toBeLessThanOrEqual(100);
    expect(s.total).toBeGreaterThan(50);
  });

  it("flags missing code/weights and unverified claims", () => {
    const s = scoreItem(item({ text: "We propose a novel method that achieves state-of-the-art results." }));
    expect(s.flags).toContain("no-code");
    expect(s.flags).toContain("no-weights");
    expect(s.flags).toContain("claims-unverified");
  });

  it("does not flag claims-unverified when a venue acceptance is present", () => {
    const s = scoreItem(
      item({ text: "We outperform prior work.", comment: "Accepted at ICML 2026", venue: "ICML 2026" }),
    );
    expect(s.flags).not.toContain("claims-unverified");
    expect(s.score.innovationEvidence).toBeGreaterThanOrEqual(10);
  });

  it("flags papers whose abstract never mentions experiments", () => {
    const s = scoreItem(item({ text: "A position paper about the future of agents." }));
    expect(s.flags).toContain("no-experiments");
  });

  it("gives repos code credit and models weights credit", () => {
    const repo = scoreItem(
      item({ key: "repo:lab/tool", kind: "repo", title: "lab/tool", text: "LLM toolkit" }),
    );
    expect(repo.score.codeWeights).toBeGreaterThanOrEqual(15);
    expect(repo.flags).not.toContain("no-code");
    const model = scoreItem(
      item({
        key: "hf:lab/m",
        kind: "model",
        title: "lab/m",
        text: "model",
        weightsUrl: "https://huggingface.co/lab/m",
      }),
    );
    expect(model.flags).not.toContain("no-weights");
  });

  it("assigns domains deterministically", () => {
    const s = scoreItem(item());
    expect(s.primaryDomain).toBe("llm-agent");
    expect(s.domains.length).toBeGreaterThan(0);
  });
});

describe("compareItems / selectPicks", () => {
  const mk = (key: string, total: number, domain: RadarItem["primaryDomain"]): RadarItem => {
    const it = scoreItem(item({ key, title: `Paper ${key}` }));
    it.total = total;
    it.primaryDomain = domain;
    it.domains = [domain];
    return it;
  };

  it("sorts by total desc", () => {
    const a = mk("a", 0, "rl");
    const b = mk("b", 0, "rl");
    a.total = 80;
    b.total = 60;
    expect(compareItems(a, b)).toBeLessThan(0);
  });

  it("clamps pick size to 10–15", () => {
    const items = Array.from({ length: 40 }, (_, i) => mk(`k${i}`, 0, "ai-general"));
    items.forEach((it, i) => (it.total = 100 - i));
    expect(selectPicks(items, 3)).toHaveLength(10);
    expect(selectPicks(items, 99)).toHaveLength(15);
    expect(selectPicks(items, 12)).toHaveLength(12);
  });

  it("ensures domain diversity when candidates exist", () => {
    // 20 strong llm-agent items, one weak item per other domain.
    const items: RadarItem[] = [];
    for (let i = 0; i < 20; i++) {
      const it = mk(`llm${i}`, 0, "llm-agent");
      it.total = 90 - i;
      items.push(it);
    }
    for (const [j, d] of (["rl", "rag-nlp", "multimodal-cv", "ai-general"] as const).entries()) {
      const it = mk(`other${j}`, 0, d);
      it.total = 10 - j;
      items.push(it);
    }
    items.sort(compareItems);
    const picks = selectPicks(items, 12);
    const domains = new Set(picks.map((p) => p.primaryDomain));
    expect(domains.size).toBe(5);
    expect(picks).toHaveLength(12);
  });
});
