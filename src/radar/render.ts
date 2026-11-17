/**
 * Template-based rendering (no LLM). Report scaffolding is bilingual zh/en,
 * but item titles and abstracts stay in the original English — nothing here
 * translates content, and the reports say so explicitly.
 */

import type { RadarItem, DomainId, SourceStatus } from "./types.ts";
import { DOMAIN_LABELS } from "./domains.ts";
import { SCORE_MAX, SOTA_RE, NOVEL_RE, EXPERIMENT_RE } from "./score.ts";

export const RADAR_REPO_URL = "https://github.com/Yaozitian0/ai-research-radar";

const FLAG_LABELS: Record<string, { zh: string; en: string }> = {
  "no-code": { zh: "未找到公开代码", en: "no public code found" },
  "no-weights": { zh: "未找到模型权重(可能不适用)", en: "no weights found (may not apply)" },
  "no-experiments": { zh: "摘要未提及实验/评测", en: "no experiments mentioned in abstract" },
  "claims-unverified": { zh: "创新性声明未验证", en: "novelty/SOTA claims unverified" },
};

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function kindLabel(kind: RadarItem["kind"]): string {
  switch (kind) {
    case "paper":
      return "论文 paper";
    case "repo":
      return "代码仓库 repo";
    case "model":
      return "模型 model";
    default:
      return "文章/讨论 article";
  }
}

/** One-line signal summary (stars, likes, HN points…). */
export function signalLine(item: RadarItem): string {
  const parts: string[] = [];
  if (item.stars !== undefined && item.stars > 0) {
    parts.push(`★ ${fmtNum(item.stars)}${item.todayStars ? ` (+${fmtNum(item.todayStars)} today)` : ""}`);
  }
  if (item.hfPaperUpvotes) parts.push(`HF papers ▲${item.hfPaperUpvotes}`);
  if (item.likes) parts.push(`HF likes ${fmtNum(item.likes)}`);
  if (item.downloads) parts.push(`downloads ${fmtNum(item.downloads)}`);
  if (item.hnPoints !== undefined && item.hnPoints > 0) {
    parts.push(`HN ${item.hnPoints} pts / ${item.hnComments ?? 0} comments`);
  }
  return parts.join(" · ");
}

/**
 * Template summary in English, built only from structured fields and regex
 * evidence. Claims are attributed to the authors and marked unverified;
 * absence of code/weights/experiments is stated explicitly.
 */
export function templateSummary(item: RadarItem): string {
  const sentences: string[] = [];
  const body = `${item.text} ${item.comment ?? ""}`;

  if (item.kind === "paper") {
    const cats = item.categories.filter((c) => c.includes(".")).slice(0, 4);
    sentences.push(
      `Preprint${cats.length ? ` (${cats.join(", ")})` : ""}${item.venue ? `; venue acceptance noted: ${item.venue}` : ""}.`,
    );
  } else if (item.kind === "repo") {
    sentences.push(
      `GitHub repository${item.sources.includes("github-new") ? " created within the last 7 days" : ""}.`,
    );
  } else if (item.kind === "model") {
    sentences.push("Model release on Hugging Face (weights downloadable).");
  } else {
    const rss = item.sources.find((s) => s.startsWith("rss:"));
    sentences.push(rss ? `Post from ${rss.slice(4)} (institutional feed).` : "Community article/discussion.");
  }

  if (SOTA_RE.test(body)) {
    sentences.push("Authors claim state-of-the-art or superior results — claim not independently verified.");
  } else if (NOVEL_RE.test(body)) {
    sentences.push("Authors propose a new method/framework — novelty not independently verified.");
  }

  const avail: string[] = [];
  if (item.codeUrl || item.kind === "repo") avail.push("code available");
  else if (item.kind === "paper") avail.push("no code link found");
  if (item.weightsUrl || item.kind === "model") avail.push("weights available");
  else if (item.kind === "paper") avail.push("no weights link found");
  if (avail.length) sentences.push(`${avail.join("; ")}.`);

  if (item.kind === "paper") {
    sentences.push(
      EXPERIMENT_RE.test(body)
        ? "Abstract mentions experiments/evaluation."
        : "Abstract does not mention experiments — reproducibility unconfirmed.",
    );
  }
  return sentences.join(" ");
}

function linksLine(item: RadarItem): string {
  const links: string[] = [`[原文/Source](${item.url})`];
  if (item.arxivId) links.push(`[arXiv](https://arxiv.org/abs/${item.arxivId})`);
  if (item.codeUrl) links.push(`[Code](${item.codeUrl})`);
  if (item.weightsUrl) links.push(`[Weights](${item.weightsUrl})`);
  if (item.projectUrl) links.push(`[Project](${item.projectUrl})`);
  if (item.hnUrl) links.push(`[HN](${item.hnUrl})`);
  return links.join(" · ");
}

function flagsLine(item: RadarItem): string {
  if (!item.flags.length) return "标注 Flags: 无缺失项 none";
  const parts = item.flags.map((f) => {
    const label = FLAG_LABELS[f];
    return label ? `⚠ ${label.zh} (${label.en})` : f;
  });
  return `标注 Flags: ${parts.join(" · ")}`;
}

function scoreLine(item: RadarItem): string {
  const s = item.score;
  return (
    `评分 Score: **${item.total}/100** — 相关性 ${s.relevance}/${SCORE_MAX.relevance} · ` +
    `创新证据 ${s.innovationEvidence}/${SCORE_MAX.innovationEvidence} · ` +
    `代码/权重 ${s.codeWeights}/${SCORE_MAX.codeWeights} · ` +
    `可信度 ${s.credibility}/${SCORE_MAX.credibility} · 可复现 ${s.reproducibility}/${SCORE_MAX.reproducibility}`
  );
}

function excerpt(item: RadarItem, max = 420): string {
  const text = item.text.trim();
  if (!text) return "(no abstract/description available)";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function renderItemBlock(item: RadarItem, rank?: number): string {
  const heading = rank !== undefined ? `## ${rank}. ${item.title}` : `## ${item.title}`;
  const domainZh = DOMAIN_LABELS[item.primaryDomain].zh;
  const lines = [
    heading,
    "",
    `- 领域 Domain: **${domainZh}** | 类型: ${kindLabel(item.kind)} | 来源: ${item.sources.join(", ")}`,
    `- ${scoreLine(item)}`,
    `- ${flagsLine(item)}`,
    `- 链接 Links: ${linksLine(item)}`,
  ];
  const signals = signalLine(item);
  if (signals) lines.push(`- 信号 Signals: ${signals}`);
  if (item.authors?.length) {
    lines.push(
      `- 作者 Authors: ${item.authors.slice(0, 6).join(", ")}${item.authors.length > 6 ? " et al." : ""}`,
    );
  }
  lines.push("", `**模板摘要 (rule-based, EN):** ${templateSummary(item)}`, "");
  lines.push(`> 原文摘录 (English original, not translated): ${excerpt(item)}`, "");
  return lines.join("\n");
}

const SCORING_DOC = `## 评分方法 Scoring (rule-based, no LLM)

总分 100 = 相关性 25 + 创新证据 20 + 代码/权重可用性 25 + 可信度 15 + 可复现性 15。
创新证据只统计可检测信号(会议接收、作者声明),**声明一律视为未验证**;缺代码/权重/实验在条目中明确标注。
Total 100 = relevance 25 + innovation evidence 20 + code/weights 25 + credibility 15 + reproducibility 15.
Author claims are treated as unverified; missing code/weights/experiments are flagged per item.`;

function sourceStatusSection(status: SourceStatus[]): string {
  const lines = status.map(
    (s) => `- ${s.ok ? "✅" : "⚠️"} ${s.name}: ${s.count} items${s.ok ? "" : " (fetch failed or empty)"}`,
  );
  return `## 数据源状态 Source status\n\n${lines.join("\n")}`;
}

function footer(utcStr: string): string {
  return `\n---\n*Generated ${utcStr} UTC by [ai-research-radar](${RADAR_REPO_URL}) — 规则评分 + 模板摘要,零 LLM、零付费 API。正文保留英文原文,未翻译。*\n`;
}

export function renderPicksReport(
  dateStr: string,
  utcStr: string,
  picks: RadarItem[],
  totalItems: number,
  status: SourceStatus[],
): string {
  const header =
    `# 🎯 每日精选 Daily Picks — ${dateStr}\n\n` +
    `> 生成时间: ${utcStr} UTC | 候选 ${totalItems} 条,精选 ${picks.length} 条(目标 10–15)\n` +
    `> Generated: ${utcStr} UTC | ${totalItems} candidates, ${picks.length} picked (target 10–15)\n\n` +
    `五领域:LLM/Agent · RL · RAG/NLP · 多模态/CV · AI 全领域。论文-代码-模型已按 arXiv id / 仓库 URL 去重合并。\n\n` +
    `${SCORING_DOC}\n\n`;
  const body = picks.map((it, i) => renderItemBlock(it, i + 1)).join("\n");
  return header + body + "\n" + sourceStatusSection(status) + footer(utcStr);
}

export function renderDomainReport(
  domain: DomainId,
  dateStr: string,
  utcStr: string,
  items: RadarItem[],
  status: SourceStatus[],
): string {
  const label = DOMAIN_LABELS[domain];
  const header =
    `# 📚 ${label.zh} 领域日报 (${label.en}) — ${dateStr}\n\n` +
    `> 生成时间: ${utcStr} UTC | 本领域候选 ${items.length} 条,展示前 ${Math.min(items.length, 12)} 条\n` +
    `> 摘要为规则模板生成,标题与摘录保留英文原文(未翻译)。缺代码/权重/实验已标注,创新声明未验证。\n\n`;
  const body = items
    .slice(0, 12)
    .map((it) => renderItemBlock(it))
    .join("\n");
  const empty = items.length === 0 ? "\n今日无匹配条目。No matching items today.\n" : "";
  return header + body + empty + "\n" + sourceStatusSection(status) + footer(utcStr);
}

export function buildRadarJson(
  dateStr: string,
  utcStr: string,
  items: RadarItem[],
  picks: RadarItem[],
  status: SourceStatus[],
): string {
  return (
    JSON.stringify(
      {
        date: dateStr,
        generated: `${utcStr} UTC`,
        pipeline: "rule-based scoring + template summaries (no LLM, no paid APIs)",
        languageNote: "titles/abstracts kept in original English; not translated",
        scoreMax: SCORE_MAX,
        sources: status,
        pickCount: picks.length,
        picks: picks.map((p) => p.key),
        items,
      },
      null,
      2,
    ) + "\n"
  );
}

/** highlights.json consumed by src/feishu.ts — bullets per report id. */
export function buildHighlights(picks: RadarItem[]): {
  zh: Record<string, string[]>;
  en: Record<string, string[]>;
} {
  const zh: string[] = [];
  const en: string[] = [];
  for (const p of picks.slice(0, 8)) {
    const title = p.title.length > 80 ? `${p.title.slice(0, 80)}…` : p.title;
    zh.push(`[${DOMAIN_LABELS[p.primaryDomain].zh}] ${title} (${p.total}/100)`);
    en.push(`[${DOMAIN_LABELS[p.primaryDomain].en}] ${title} (${p.total}/100)`);
  }
  return { zh: { "radar-picks": zh }, en: { "radar-picks": en } };
}
