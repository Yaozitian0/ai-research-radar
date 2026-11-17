import { describe, it, expect } from "vitest";
import { templateSummary, renderPicksReport, renderDomainReport, buildHighlights } from "../radar/render.ts";
import { scoreItem } from "../radar/score.ts";
import type { RadarItem, SourceStatus } from "../radar/types.ts";

function item(overrides: Partial<RadarItem> = {}): RadarItem {
  return scoreItem({
    key: "arxiv:2501.00001",
    kind: "paper",
    title: "A Novel LLM Agent Framework",
    text: "We propose a novel agent framework that achieves state-of-the-art results.",
    url: "https://arxiv.org/abs/2501.00001",
    arxivId: "2501.00001",
    categories: ["cs.CL"],
    sources: ["arxiv"],
    domains: [],
    primaryDomain: "ai-general",
    flags: [],
    score: { relevance: 0, innovationEvidence: 0, codeWeights: 0, credibility: 0, reproducibility: 0 },
    total: 0,
    ...overrides,
  });
}

const status: SourceStatus[] = [{ name: "arXiv", ok: true, count: 10 }];

describe("templateSummary", () => {
  it("attributes SOTA claims to authors and marks them unverified", () => {
    const s = templateSummary(item());
    expect(s).toContain("Authors claim");
    expect(s).toContain("not independently verified");
  });

  it("states missing code and weights explicitly", () => {
    const s = templateSummary(item());
    expect(s).toContain("no code link found");
    expect(s).toContain("no weights link found");
  });

  it("mentions code availability when a link exists", () => {
    const s = templateSummary(item({ codeUrl: "https://github.com/lab/fw" }));
    expect(s).toContain("code available");
  });

  it("notes missing experiments", () => {
    const s = templateSummary(item({ text: "A vision paper about agents." }));
    expect(s).toContain("does not mention experiments");
  });
});

describe("renderPicksReport", () => {
  it("contains ranking, flags, scoring doc and the no-translation note", () => {
    const md = renderPicksReport("2026-11-17", "2026-11-17 01:00", [item()], 1, status);
    expect(md).toContain("每日精选");
    expect(md).toContain("## 1. A Novel LLM Agent Framework");
    expect(md).toContain("未找到公开代码");
    expect(md).toContain("创新性声明未验证");
    expect(md).toContain("评分方法");
    expect(md).toContain("未翻译");
    expect(md).toContain("数据源状态");
  });
});

describe("renderDomainReport", () => {
  it("renders an empty-domain notice", () => {
    const md = renderDomainReport("rl", "2026-11-17", "2026-11-17 01:00", [], status);
    expect(md).toContain("强化学习");
    expect(md).toContain("No matching items today");
  });
});

describe("buildHighlights", () => {
  it("produces radar-picks bullets for zh and en", () => {
    const h = buildHighlights([item()]);
    expect(h.zh["radar-picks"]).toHaveLength(1);
    expect(h.en["radar-picks"]).toHaveLength(1);
    expect(h.zh["radar-picks"]![0]).toContain("/100");
  });
});
