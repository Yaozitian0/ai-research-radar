# CLAUDE.md

This repository was rebuilt from the original agents-radar LLM digest pipeline into a **zero-cost AI research radar** (rule-based scoring + template summaries, no LLM, no paid APIs).

The authoritative, up-to-date guide for AI agents working in this repo is **[AGENTS.md](AGENTS.md)** — architecture, commands, conventions and report outputs are documented there. The previous LLM-era instructions (providers, prompts, translation passes, issue lifecycle) no longer apply: those modules were removed.

Hard rules:

- Daily cron is `0 1 * * *` UTC = 09:00 Beijing time; keep `workflow_dispatch`. Edit the workflow trigger section in place — never overwrite the whole workflow file.
- No paid APIs or LLM keys anywhere; secrets never go into code. Feishu push reads the `FEISHU_WEBHOOK` secret and must skip gracefully when it is unset.
- Item titles/abstracts stay in the original English; never claim machine translation.
- Author novelty/SOTA claims are always marked unverified; missing code/weights/experiments are explicitly flagged.