import { describe, it, expect } from "vitest";
import { parseFeedBlock } from "../radar/rss.ts";

const NOW = Date.now();
const recent = new Date(NOW - 3600_000).toUTCString();
const old = new Date(NOW - 72 * 3600_000).toUTCString();

describe("parseFeedBlock", () => {
  it("parses a fresh RSS item", () => {
    const block = `<item><title>New Model Release</title><link>https://lab.example/post</link><description>We released a model.</description><pubDate>${recent}</pubDate></item>`;
    const item = parseFeedBlock(block, "TestLab", NOW - 48 * 3600_000);
    expect(item).not.toBeNull();
    expect(item!.title).toBe("New Model Release");
    expect(item!.url).toBe("https://lab.example/post");
    expect(item!.feedName).toBe("TestLab");
  });

  it("parses an Atom entry", () => {
    const iso = new Date(NOW - 3600_000).toISOString();
    const block = `<entry><title>Atom Post</title><link rel="alternate" href="https://lab.example/atom"/><summary>Summary text</summary><published>${iso}</published></entry>`;
    const item = parseFeedBlock(block, "TestLab", NOW - 48 * 3600_000);
    expect(item).not.toBeNull();
    expect(item!.url).toBe("https://lab.example/atom");
  });

  it("drops stale and undated items", () => {
    const stale = `<item><title>Old</title><link>https://lab.example/old</link><pubDate>${old}</pubDate></item>`;
    const undated = `<item><title>No date</title><link>https://lab.example/x</link></item>`;
    expect(parseFeedBlock(stale, "TestLab", NOW - 48 * 3600_000)).toBeNull();
    expect(parseFeedBlock(undated, "TestLab", NOW - 48 * 3600_000)).toBeNull();
  });

  it("strips CDATA and tags from descriptions", () => {
    const block = `<item><title><![CDATA[Title & More]]></title><link>https://lab.example/p</link><description><![CDATA[<p>Hello <b>world</b></p>]]></description><pubDate>${recent}</pubDate></item>`;
    const item = parseFeedBlock(block, "TestLab", NOW - 48 * 3600_000);
    expect(item!.title).toBe("Title & More");
    expect(item!.text).toBe("Hello world");
  });
});
