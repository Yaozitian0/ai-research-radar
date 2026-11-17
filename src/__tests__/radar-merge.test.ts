import { describe, it, expect } from "vitest";
import {
  normalizeArxivId,
  normalizeRepoUrl,
  extractGithubUrls,
  mergeItems,
  repoKey,
} from "../radar/merge.ts";
import type { MergeInputs } from "../radar/merge.ts";
import type { ArxivPaper } from "../arxiv.ts";

function emptyInputs(): MergeInputs {
  return {
    arxivPapers: [],
    hfPapers: [],
    hfModels: [],
    trending: { trendingRepos: [], searchRepos: [], trendingFetchSuccess: false },
    hnStories: [],
    rssItems: [],
  };
}

function paper(overrides: Partial<ArxivPaper> = {}): ArxivPaper {
  return {
    id: "http://arxiv.org/abs/2501.01234v1",
    title: "A Novel Agent Framework",
    summary: "We propose a novel LLM agent. Code: https://github.com/lab/agent-fw",
    authors: ["Alice", "Bob"],
    published: new Date().toISOString(),
    updated: new Date().toISOString(),
    categories: ["cs.AI", "cs.CL"],
    url: "http://arxiv.org/abs/2501.01234v1",
    pdfUrl: "http://arxiv.org/pdf/2501.01234v1",
    comment: "",
    ...overrides,
  };
}

describe("normalizeArxivId", () => {
  it("strips version and URL prefix", () => {
    expect(normalizeArxivId("http://arxiv.org/abs/2501.01234v2")).toBe("2501.01234");
    expect(normalizeArxivId("https://arxiv.org/pdf/2501.01234v1")).toBe("2501.01234");
    expect(normalizeArxivId("2501.01234")).toBe("2501.01234");
    expect(normalizeArxivId("2501.01234v3")).toBe("2501.01234");
  });

  it("rejects non-arxiv strings", () => {
    expect(normalizeArxivId("https://example.com/abs/2501.01234")).toBeNull();
    expect(normalizeArxivId("not-an-id")).toBeNull();
  });
});

describe("normalizeRepoUrl", () => {
  it("normalizes repo URLs", () => {
    expect(normalizeRepoUrl("https://github.com/Lab/Repo.git")).toBe("https://github.com/Lab/Repo");
    expect(normalizeRepoUrl("https://github.com/lab/repo/issues/3")).toBe("https://github.com/lab/repo");
  });

  it("rejects non-repo GitHub paths", () => {
    expect(normalizeRepoUrl("https://github.com/topics/llm")).toBeNull();
    expect(normalizeRepoUrl("https://github.com/trending")).toBeNull();
    expect(normalizeRepoUrl("https://example.com/lab/repo")).toBeNull();
  });
});

describe("extractGithubUrls", () => {
  it("finds repo links in free text and dedups", () => {
    const text = "Code at https://github.com/lab/fw and https://github.com/lab/fw (mirror).";
    expect(extractGithubUrls(text)).toEqual(["https://github.com/lab/fw"]);
  });
});

describe("mergeItems", () => {
  it("merges arXiv and HF papers by bare id", () => {
    const inputs = emptyInputs();
    inputs.arxivPapers = [paper()];
    inputs.hfPapers = [
      {
        arxivId: "2501.01234",
        title: "A Novel Agent Framework",
        summary: "",
        authors: [],
        upvotes: 42,
        publishedAt: new Date().toISOString(),
        githubRepo: "lab/agent-fw",
      },
    ];
    const items = mergeItems(inputs);
    const papers = items.filter((i) => i.kind === "paper");
    expect(papers).toHaveLength(1);
    expect(papers[0]!.sources).toContain("arxiv");
    expect(papers[0]!.sources).toContain("hf-papers");
    expect(papers[0]!.hfPaperUpvotes).toBe(42);
    expect(papers[0]!.codeUrl).toBe("https://github.com/lab/agent-fw");
  });

  it("absorbs a trending repo linked from the paper abstract", () => {
    const inputs = emptyInputs();
    inputs.arxivPapers = [paper()];
    inputs.trending = {
      trendingRepos: [
        {
          fullName: "lab/agent-fw",
          description: "LLM agent framework",
          language: "Python",
          todayStars: 120,
          totalStars: 3400,
          forks: 200,
          url: "https://github.com/lab/agent-fw",
        },
      ],
      searchRepos: [],
      trendingFetchSuccess: true,
    };
    const items = mergeItems(inputs);
    expect(items.filter((i) => i.kind === "repo")).toHaveLength(0);
    const p = items.find((i) => i.kind === "paper")!;
    expect(p.stars).toBe(3400);
    expect(p.todayStars).toBe(120);
    expect(p.sources).toContain("github-trending");
    expect(p.codeUrl).toBe("https://github.com/lab/agent-fw");
  });

  it("merges an HF model tagged with the paper's arxiv id as weights", () => {
    const inputs = emptyInputs();
    inputs.arxivPapers = [paper({ summary: "We propose a novel LLM." })];
    inputs.hfModels = [
      {
        id: "lab/agent-model",
        author: "lab",
        likes: 300,
        downloads: 50000,
        tags: ["arxiv:2501.01234", "text-generation"],
        pipelineTag: "text-generation",
        lastModified: new Date().toISOString(),
        url: "https://huggingface.co/lab/agent-model",
      },
    ];
    const items = mergeItems(inputs);
    expect(items.filter((i) => i.kind === "model")).toHaveLength(0);
    const p = items.find((i) => i.kind === "paper")!;
    expect(p.weightsUrl).toBe("https://huggingface.co/lab/agent-model");
    expect(p.likes).toBe(300);
    expect(p.sources).toContain("hf-models");
  });

  it("merges HN stories pointing at arXiv or GitHub", () => {
    const inputs = emptyInputs();
    inputs.arxivPapers = [paper()];
    inputs.hnStories = [
      {
        id: "1",
        title: "A Novel Agent Framework",
        url: "https://arxiv.org/abs/2501.01234",
        hnUrl: "https://news.ycombinator.com/item?id=1",
        points: 250,
        comments: 80,
        author: "x",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Show HN: some AI tool",
        url: "https://github.com/other/ai-tool",
        hnUrl: "https://news.ycombinator.com/item?id=2",
        points: 100,
        comments: 20,
        author: "y",
        createdAt: new Date().toISOString(),
      },
    ];
    const items = mergeItems(inputs);
    const p = items.find((i) => i.kind === "paper")!;
    expect(p.hnPoints).toBe(250);
    expect(p.sources).toContain("hn");
    const repo = items.find((i) => i.key === repoKey("https://github.com/other/ai-tool"))!;
    expect(repo.hnPoints).toBe(100);
  });

  it("dedups the same repo across trending and search", () => {
    const inputs = emptyInputs();
    inputs.trending = {
      trendingRepos: [
        {
          fullName: "lab/llm-tool",
          description: "LLM toolkit",
          language: "Python",
          todayStars: 10,
          totalStars: 900,
          forks: 5,
          url: "https://github.com/lab/llm-tool",
        },
      ],
      searchRepos: [
        {
          fullName: "lab/llm-tool",
          description: "LLM toolkit",
          language: "Python",
          stargazersCount: 950,
          pushedAt: new Date().toISOString(),
          url: "https://github.com/lab/llm-tool",
          searchQuery: "new:llm",
        },
      ],
      trendingFetchSuccess: true,
    };
    const items = mergeItems(inputs);
    const repos = items.filter((i) => i.kind === "repo");
    expect(repos).toHaveLength(1);
    expect(repos[0]!.stars).toBe(950);
    expect(repos[0]!.sources).toContain("github-new");
  });

  it("filters non-AI trending repos", () => {
    const inputs = emptyInputs();
    inputs.trending = {
      trendingRepos: [
        {
          fullName: "someone/recipes",
          description: "Collection of cooking recipes",
          language: "",
          todayStars: 50,
          totalStars: 1000,
          forks: 10,
          url: "https://github.com/someone/recipes",
        },
      ],
      searchRepos: [],
      trendingFetchSuccess: true,
    };
    expect(mergeItems(inputs)).toHaveLength(0);
  });
});
