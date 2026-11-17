/**
 * Research-institution RSS/Atom feeds (free, no keys).
 *
 * Lightweight regex parsing in the same style as src/arxiv.ts — good enough
 * for the well-formed feeds of research labs. Items older than 48h are
 * dropped; a feed that fails or is stale simply contributes nothing.
 */

import type { RssItem } from "./merge.ts";

const FETCH_TIMEOUT_MS = 12_000;
const MAX_ITEMS_PER_FEED = 10;
const WINDOW_MS = 48 * 60 * 60 * 1000;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; ai-research-radar/1.0)",
  Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
};

function stripTags(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? stripTags(m[1]!) : "";
}

function atomLink(block: string): string {
  const m =
    block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i) ?? block.match(/<link[^>]*href="([^"]+)"/i);
  return m ? m[1]! : "";
}

function parseDate(s: string): number {
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}

/** Parse one RSS <item> or Atom <entry> block. Returns null when undated/stale. */
export function parseFeedBlock(block: string, feedName: string, cutoff: number): RssItem | null {
  const isAtom = /<entry[\s>]/i.test(block) || !/<item[\s>]/i.test(block);
  const title = tag(block, "title");
  const url = isAtom ? atomLink(block) : tag(block, "link");
  const text = tag(block, "description") || tag(block, "summary") || tag(block, "content");
  const dateStr =
    tag(block, "pubDate") || tag(block, "published") || tag(block, "updated") || tag(block, "dc:date");
  const ts = parseDate(dateStr);
  if (!title || !url || !ts || ts < cutoff) return null;
  return {
    feedName,
    title,
    url,
    text: text.slice(0, 600),
    publishedAt: new Date(ts).toISOString(),
  };
}

export async function fetchRssFeed(name: string, url: string): Promise<RssItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const resp = await fetch(url, { headers: HEADERS, signal: controller.signal });
    if (!resp.ok) {
      console.error(`  [rss/${name}] HTTP ${resp.status}`);
      return [];
    }
    const xml = await resp.text();
    const cutoff = Date.now() - WINDOW_MS;
    const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
    const items: RssItem[] = [];
    for (const block of blocks) {
      const item = parseFeedBlock(block, name, cutoff);
      if (item) items.push(item);
      if (items.length >= MAX_ITEMS_PER_FEED) break;
    }
    console.log(`  [rss/${name}] ${items.length} fresh items (${blocks.length} in feed)`);
    return items;
  } catch (err) {
    console.error(`  [rss/${name}] fetch failed: ${err}`);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchAllRss(feeds: { name: string; url: string }[]): Promise<RssItem[]> {
  const results = await Promise.all(feeds.map((f) => fetchRssFeed(f.name, f.url)));
  return results.flat();
}
