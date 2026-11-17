# 📡 AI 科研雷达(ai-research-radar)

[English](README.md) | 中文

每日 AI 科研雷达,覆盖五领域,**零付费:无 LLM、无付费 API**。Fork 自 [duanyytop/agents-radar](https://github.com/duanyytop/agents-radar),原 LLM 摘要管线已替换为**规则评分 + 模板摘要**。

- **看板(GitHub Pages)**:<https://yaozitian0.github.io/ai-research-radar>
- **定时**:每天**北京时间 09:00**(Actions cron `0 1 * * *`,UTC;cron 不支持 timezone 字段),另保留手动 `workflow_dispatch`。
- **归档**:仓库内 `digests/YYYY-MM-DD/` 按日期归档 md + json,另有 RSS(`feed.xml`)。

## 五领域

| 领域 | 报告 id |
| --- | --- |
| LLM/Agent | `radar-llm-agent` |
| 强化学习 RL | `radar-rl` |
| RAG/NLP | `radar-rag-nlp` |
| 多模态/CV | `radar-multimodal-cv` |
| AI 全领域 | `radar-ai-general` |

另有排序后的**每日精选**(`radar-picks`,10–15 条)与结构化 `radar.json`。

## 数据源(全部免费、无需密钥)

- **arXiv**:cs.AI / cs.CL / cs.LG / cs.CV / cs.IR 最新提交(48h 窗口,429 自动退避重试)。
- **GitHub**:trending 页 + 主题搜索(活跃仓库)+ 近 7 天新建仓库。
- **Hugging Face**:每日论文(`/api/daily_papers`)+ 热门模型(`/api/models`)。
- **研究机构 RSS**:OpenAI、Google DeepMind、Google AI、Microsoft Research、BAIR、Stanford AI、CMU ML、HF Blog(可在 `config.yml` 增删)。
- **Hacker News**:AI 相关热帖。

**论文-代码-模型按 arXiv id / 仓库 URL 去重合并**:论文吸收其关联仓库的 star 信号与 HF 模型的权重/下载量,HN 讨论热度挂到同一条目。

## 排序(规则化、确定性)

总分 **100** = 相关性 **25** + 创新证据 **20** + 代码/权重可用性 **25** + 可信度 **15** + 可复现性 **15**。

- 创新证据只统计可检测信号(arXiv comment 中的会议接收、作者声明);**声明一律标注"未验证"**,不下确定性结论。
- 缺代码/权重/实验逐条明确标注(`no-code`、`no-weights`、`no-experiments`、`claims-unverified`)。
- 每日精选带软性领域多样性:五领域有候选时尽量都出现。
- 摘要为**模板生成**;标题与摘要保留**英文原文**,不做也不声称机器翻译。

## 飞书推送

`src/feishu.ts` 实现推送,每次日报后运行。在仓库 Secrets 设置 **`FEISHU_WEBHOOK`**(自定义机器人 webhook,支持逗号分隔多个)。**未设置时优雅跳过**,代码中不含任何真实 webhook。

## 配置与本地运行

`config.yml` 控制精选条数(10–15)、arXiv 分类、RSS 列表。密钥不进代码,见 `.env.example`。`GITHUB_TOKEN` 本地可选(提高搜索限额),CI 自动注入。

```bash
pnpm install
pnpm start          # 运行雷达(写入 digests/<今天>/)
pnpm manifest       # 重建 manifest.json + feed.xml
pnpm notify:feishu  # 飞书推送(无 FEISHU_WEBHOOK 时跳过)
pnpm test && pnpm lint && pnpm typecheck
```

## 许可

MIT,见 [LICENSE](LICENSE)。原始 agents-radar 代码作者 duanyytop;本 fork 完成雷达化改造。