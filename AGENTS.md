# AGENTS.md

## Project overview

ai-research-radar is a daily AI research radar (fork of duanyytop/agents-radar, rebuilt). A GitHub Actions cron runs at **01:00 UTC = 09:00 Beijing time** (`cron: "0 1 * * *"`; Actions cron has no timezone field) plus `workflow_dispatch`. It fetches free sources, merges/dedups items, scores them with deterministic rules, and commits dated Markdown + JSON reports. **No LLM, no paid APIs, no required secrets.** Item titles/abstracts stay in original English — never claim translation.

## Commands

```bash
pnpm start          # run the radar locally (writes digests/<CST today>/)
pnpm manifest       # rebuild manifest.json + feed.xml
pnpm notify:feishu  # Feishu push; skips gracefully without FEISHU_WEBHOOK
pnpm test           # vitest
pnpm typecheck      # tsc --noEmit
pnpm lint           # ESLint
pnpm format         # Prettier --write src
pnpm format:check   # Prettier --check src
```

Env vars (all optional): `GITHUB_TOKEN` (search rate limits; auto-injected in CI), `FEISHU_WEBHOOK` (notification secret; never hardcode), `PAGES_URL`. The pre-commit hook runs lint + format:check + typecheck.

## Architecture

Pipeline entry: `src/radar.ts` — fetch → merge → score → select → render → save.

| File | Responsibility |
|------|---------------|
| `src/radar.ts` | Orchestration; refuses to publish when ALL sources fail |
| `src/radar/types.ts` | `RadarItem`, `DomainId`, `ScoreBreakdown`, `RadarConfig` |
| `src/radar/domains.ts` | Keyword classification into 5 domains + AI repo filter |
| `src/radar/score.ts` | Rule scoring (25/20/25/15/15 = 100), flags, `selectPicks` (10–15, soft domain diversity) |
| `src/radar/merge.ts` | Normalize arXiv ids / repo URLs; dedup; merge paper↔repo↔model↔HN↔RSS |
| `src/radar/rss.ts` | Institutional RSS/Atom fetch + parse (48h window, per-feed failure tolerated) |
| `src/radar/render.ts` | Template summaries + Markdown/JSON/highlights rendering |
| `src/arxiv.ts` | arXiv Atom API, 5 categories, 429 backoff retry |
| `src/hf.ts` | HF trending models + daily papers APIs |
| `src/trending.ts` | GitHub trending HTML + topic search (active + newly created repos) |
| `src/hn.ts` | HN Firebase API, AI keyword filter |
| `src/config.ts` | Loads `config.yml` (`radar.pick_count`, `arxiv_categories`, `rss_feeds`) with defaults |
| `src/feishu.ts` | Feishu card push; reads `FEISHU_WEBHOOK` (legacy `FEISHU_WEBHOOK_URLS`/`_URL` aliases) |
| `src/generate-manifest.ts` | `manifest.json` + `feed.xml` for the Pages dashboard |
| `src/i18n.ts` | Labels (`REPORT_LABELS`, `NOTIFY_LABELS`) incl. legacy archive labels |
| `src/github.ts` | Legacy GitHub helpers (kept; issue creation unused by the radar) |
| `src/report.ts` | `saveFile`, `autoGenFooter` only — LLM machinery removed |

## Report outputs (digests/YYYY-MM-DD/)

`radar-picks.md` (ranked 10–15), `radar-llm-agent.md`, `radar-rl.md`, `radar-rag-nlp.md`, `radar-multimodal-cv.md`, `radar-ai-general.md`, `radar.json` (full structured archive), `highlights.json` (Feishu bullets). Legacy `ai-*` archives remain browsable.

## Key conventions

- Scoring is deterministic and documented in `src/radar/score.ts`; author claims are always flagged `claims-unverified` unless venue acceptance is detected. Missing code/weights/experiments must stay explicitly flagged.
- Dedup keys: `arxiv:<bare id>`, `repo:<owner/name lowercased>`, `hf:<model id>`, `url:<normalized>`. Cross-merge absorbs repo/model items into their paper.
- When adding a report id, keep three places in sync: `REPORT_FILES` (generate-manifest.ts), `REPORT_LABELS`/`NOTIFY_LABELS` (i18n.ts), `LABELS` (index.html).
- Workflow edits: change the trigger section in place; keep `workflow_dispatch`, the guard job and the concurrency group. Do not add paid-API env vars or secrets values to code.
- Pages: legacy build from `master` root (`.nojekyll` present); pushing to master republishes the dashboard.
- `mcp/` is a standalone Cloudflare Worker (own lockfile) exposing the digest data; not part of CI.