# 📡 AI Research Radar

**[中文说明](README.zh.md)** | Daily AI research radar across five domains — **zero cost: no LLM, no paid APIs**.

Forked from [duanyytop/agents-radar](https://github.com/duanyytop/agents-radar) and rebuilt as a research-focused radar: rule-based scoring + template summaries replace the original LLM pipeline.

- **Dashboard (GitHub Pages)**: <https://yaozitian0.github.io/ai-research-radar>
- **Schedule**: daily at **09:00 Beijing time** (`cron: "0 1 * * *"` UTC) + manual `workflow_dispatch`.
- **Archives**: dated Markdown + JSON under [`digests/YYYY-MM-DD/`](digests/), plus an RSS feed (`feed.xml`).

## Five domains

| Domain | Report id |
| --- | --- |
| LLM/Agent | `radar-llm-agent` |
| Reinforcement Learning | `radar-rl` |
| RAG/NLP | `radar-rag-nlp` |
| Multimodal/CV | `radar-multimodal-cv` |
| AI general | `radar-ai-general` |

Plus a ranked **daily picks** report (`radar-picks`, 10–15 items) and a structured `radar.json` archive.

## Sources (all free, no keys required)

- **arXiv** — cs.AI / cs.CL / cs.LG / cs.CV / cs.IR, newest submissions (48h window, 429 backoff).
- **GitHub** — trending page + topic search for active repos + newly created repos (last 7 days).
- **Hugging Face** — daily papers (`/api/daily_papers`) + trending models (`/api/models`).
- **Research-institution RSS** — OpenAI, Google DeepMind, Google AI, Microsoft Research, BAIR, Stanford AI, CMU ML, HF Blog (editable in `config.yml`).
- **Hacker News** — AI-filtered top stories.

Papers, code and models are **deduped and merged by arXiv id / repository URL**: a paper absorbs its linked repo's stars and its HF model's weights/downloads; HN discussion points attach to the same item.

## Ranking (rule-based, deterministic)

Total **100** = relevance **25** + innovation evidence **20** + code/weights availability **25** + credibility **15** + reproducibility **15**.

- Innovation evidence counts only detectable signals (venue acceptance in the arXiv comment, author claims). **Claims are always marked unverified** — the radar never states novelty as a fact.
- Missing code / weights / experiments are **explicitly flagged** per item (`no-code`, `no-weights`, `no-experiments`, `claims-unverified`).
- Daily picks use soft domain diversity so all five domains appear when candidates exist.
- Summaries are **template-generated**; titles and abstracts stay in the **original English** (no machine translation is performed or claimed).

## Notifications

Feishu/Lark push is implemented in `src/feishu.ts` and runs after each digest. Set the repository secret **`FEISHU_WEBHOOK`** (custom-bot webhook URL; comma-separated list supported). **When the secret is unset the step skips gracefully** — no webhook is hardcoded.

## Configuration

`config.yml` controls pick count (10–15), arXiv categories and RSS feeds. No secrets live in code; see [`.env.example`](.env.example). `GITHUB_TOKEN` is optional locally (raises search rate limits) and injected automatically in CI.

## Local development

```bash
pnpm install
pnpm start          # run the radar (writes digests/<today>/)
pnpm manifest       # rebuild manifest.json + feed.xml
pnpm notify:feishu  # Feishu push (skips without FEISHU_WEBHOOK)
pnpm test && pnpm lint && pnpm typecheck
```

## License

MIT — see [LICENSE](LICENSE). Original agents-radar code by duanyytop; radar rewrite in this fork.