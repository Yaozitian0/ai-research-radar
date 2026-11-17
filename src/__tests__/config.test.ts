import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "node:fs";
import { loadRadarConfig, DEFAULT_ARXIV_CATEGORIES, DEFAULT_RSS_FEEDS } from "../config.ts";

describe("loadRadarConfig", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns defaults when the file is missing", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(false);
    const cfg = loadRadarConfig("missing.yml");
    expect(cfg.pickCount).toBe(12);
    expect(cfg.arxivCategories).toEqual(DEFAULT_ARXIV_CATEGORIES);
    expect(cfg.rssFeeds).toEqual(DEFAULT_RSS_FEEDS);
  });

  it("loads pick_count, categories and feeds from yaml", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(`
radar:
  pick_count: 15
  arxiv_categories:
    - cs.AI
    - cs.CL
  rss_feeds:
    - name: Test Lab
      url: https://example.com/feed.xml
`);
    const cfg = loadRadarConfig("test.yml");
    expect(cfg.pickCount).toBe(15);
    expect(cfg.arxivCategories).toEqual(["cs.AI", "cs.CL"]);
    expect(cfg.rssFeeds).toEqual([{ name: "Test Lab", url: "https://example.com/feed.xml" }]);
  });

  it("clamps pick_count into 10–15", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue("radar:\n  pick_count: 3\n");
    expect(loadRadarConfig("test.yml").pickCount).toBe(10);
    vi.spyOn(fs, "readFileSync").mockReturnValue("radar:\n  pick_count: 99\n");
    expect(loadRadarConfig("test.yml").pickCount).toBe(15);
  });

  it("falls back per-section when sections are absent or invalid", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue("radar:\n  pick_count: not-a-number\n  rss_feeds: []\n");
    const cfg = loadRadarConfig("test.yml");
    expect(cfg.pickCount).toBe(12);
    expect(cfg.arxivCategories).toEqual(DEFAULT_ARXIV_CATEGORIES);
    expect(cfg.rssFeeds).toEqual(DEFAULT_RSS_FEEDS);
  });

  it("drops malformed feed entries", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(`
radar:
  rss_feeds:
    - name: Good
      url: https://example.com/rss
    - name: NoUrl
`);
    const cfg = loadRadarConfig("test.yml");
    expect(cfg.rssFeeds).toEqual([{ name: "Good", url: "https://example.com/rss" }]);
  });

  it("defaults when the radar section is absent", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue("other: true\n");
    const cfg = loadRadarConfig("test.yml");
    expect(cfg.pickCount).toBe(12);
    expect(cfg.rssFeeds.length).toBeGreaterThan(0);
  });
});
