/**
 * File output helpers. The LLM machinery that used to live here was removed
 * with the zero-cost rewrite — the radar uses rule-based scoring and template
 * summaries (see src/radar/).
 */

import fs from "node:fs";
import path from "node:path";
import { type Lang, FOOTER } from "./i18n.ts";

export function saveFile(content: string, ...segments: string[]): string {
  const filepath = path.join("digests", ...segments);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content, "utf-8");
  return filepath;
}

export function autoGenFooter(lang: Lang = "zh"): string {
  const digestRepo = process.env["DIGEST_REPO"] ?? "";
  if (!digestRepo) return "";
  return `\n\n---\n*${FOOTER.autoGen[lang]} [ai-research-radar](https://github.com/${digestRepo})${lang === "en" ? "." : " 自动生成。"}*`;
}
