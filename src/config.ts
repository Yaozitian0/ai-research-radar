/**
 * Loads ai-research-radar configuration from config.yml.
 * Falls back to built-in defaults when the file or a section is missing.
 */

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { RadarConfig } from "./radar/types.ts";

interface RawFeed {
  name?: string;
  url?: string;
}

interface RawConfig {
  radar?: {
    pick_count?: number;
    arxiv_categories?: string[];
    rss_feeds?: RawFeed[];
  };
}

export const DEFAULT_ARXIV_CATEGORIES = ["cs.AI", "cs.CL", "cs.LG", "cs.CV", "cs.IR"];

export const DEFAULT_RSS_FEEDS: { name: string; url: string }[] = [
  { name: "OpenAI", url: "https://openai.com/news/rss.xml" },
  { name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml" },
  { name: "Google AI", url: "https://blog.google/technology/ai/rss/" },
  { name: "Microsoft Research", url: "https://www.microsoft.com/en-us/research/feed/" },
  { name: "BAIR (Berkeley)", url: "https://bair.berkeley.edu/blog/feed.xml" },
  { name: "Stanford AI", url: "https://ai.stanford.edu/blog/feed.xml" },
  { name: "CMU ML", url: "https://blog.ml.cmu.edu/feed/" },
  { name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml" },
];

const DEFAULT_PICK_COUNT = 12;

export function loadRadarConfig(configPath = "config.yml"): RadarConfig {
  const resolved = path.resolve(configPath);
  const defaults: RadarConfig = {
    pickCount: DEFAULT_PICK_COUNT,
    arxivCategories: DEFAULT_ARXIV_CATEGORIES,
    rssFeeds: DEFAULT_RSS_FEEDS,
  };

  if (!fs.existsSync(resolved)) {
    console.log(`[config] ${configPath} not found — using built-in defaults.`);
    return defaults;
  }

  const raw = yaml.load(fs.readFileSync(resolved, "utf-8")) as RawConfig | null;
  const radar = raw?.radar ?? {};

  const pickCount =
    typeof radar.pick_count === "number" && Number.isFinite(radar.pick_count)
      ? Math.max(10, Math.min(15, Math.round(radar.pick_count)))
      : DEFAULT_PICK_COUNT;

  const arxivCategories =
    Array.isArray(radar.arxiv_categories) && radar.arxiv_categories.length > 0
      ? radar.arxiv_categories.filter((c): c is string => typeof c === "string" && c.trim().length > 0)
      : DEFAULT_ARXIV_CATEGORIES;

  const rssFeeds =
    Array.isArray(radar.rss_feeds) && radar.rss_feeds.length > 0
      ? radar.rss_feeds
          .filter((f): f is { name: string; url: string } => Boolean(f?.name && f?.url))
          .map((f) => ({ name: f.name, url: f.url }))
      : DEFAULT_RSS_FEEDS;

  console.log(
    `[config] Loaded from ${configPath}: pick_count=${pickCount}, ` +
      `${arxivCategories.length} arXiv categories, ${rssFeeds.length} RSS feeds`,
  );
  return { pickCount, arxivCategories, rssFeeds };
}
