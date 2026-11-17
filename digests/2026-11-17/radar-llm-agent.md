# 📚 LLM/Agent 领域日报 (LLM/Agent) — 2026-11-17

> 生成时间: 2026-11-17 14:17 UTC | 本领域候选 446 条,展示前 12 条
> 摘要为规则模板生成,标题与摘录保留英文原文(未翻译)。缺代码/权重/实验已标注,创新声明未验证。

## [CLS] and [EOS] Tokens are not Enough for CLIP-based Class-Incremental Learning

- 领域 Domain: **多模态/CV** | 类型: 论文 paper | 来源: arxiv
- 评分 Score: **73/100** — 相关性 20/25 · 创新证据 20/20 · 代码/权重 15/25 · 可信度 7/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply))
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.21440) · [arXiv](https://arxiv.org/abs/2611.21440) · [Code](https://github.com/LAMDA-CL/PACE)
- 作者 Authors: Hao Sun, Tao Hu, Shixiong Kai, Siyuan Xu, Wenqian Zhao, Mingxuan Yuan et al.

**模板摘要 (rule-based, EN):** Preprint (cs.CV); venue acceptance noted: acceptance noted in arXiv comment (venue not parsed). Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Class-Incremental Learning (CIL) aims to empower models to continuously acquire new knowledge while mitigating catastrophic forgetting. With the advent of vision-language models like CLIP, leveraging their cross-modal alignment capabilities to address CIL challenges has emerged as a dominant paradigm. Existing methods leverage CLIP's global representations (i.e., the visual [CLS] token and the textual [EOS] token) fo…

## Living Context Graphs: Continual Semantic Learning for Enterprise Data Reasoning

- 领域 Domain: **LLM/Agent** | 类型: 论文 paper | 来源: arxiv
- 评分 Score: **70/100** — 相关性 23/25 · 创新证据 14/20 · 代码/权重 15/25 · 可信度 7/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply))
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.20976) · [arXiv](https://arxiv.org/abs/2611.20976) · [Code](https://github.com/varunagrawal2002/Living-Context-Graph)
- 作者 Authors: Varun Agrawal, Ayush Srivastava, Eshan Gujar, Kaushal Kumar, Ayush Gupta

**模板摘要 (rule-based, EN):** Preprint (cs.CL, cs.AI, cs.DB, cs.ET); venue acceptance noted: NeurIPS 2026 Workshop on Continual Learning in the Era of. Authors propose a new method/framework — novelty not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Enterprise AI can now perform analytics, reporting, and data-driven workflows, yet the data foundations it relies on remain hard to operationalize: business meaning, relationships, metric definitions, and reporting conventions are absent from database schemas and scattered across undocumented systems and tribal knowledge. We introduce the Living Context Graph (LCG), a continually learned context layer that makes exis…

## DetourBench: Trajectory-Level Evaluation of Interactive Agents with Exact Minimum-Action Bounds

- 领域 Domain: **LLM/Agent** | 类型: 论文 paper | 来源: arxiv
- 评分 Score: **70/100** — 相关性 23/25 · 创新证据 14/20 · 代码/权重 15/25 · 可信度 7/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply))
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.20844) · [arXiv](https://arxiv.org/abs/2611.20844) · [Code](https://github.com/DatagridsAI/DetourBench)
- 作者 Authors: Hanlin Tian, Sihan Zhu, Zhao Yang, Yuxiang Wang, Zhiquan Hu, Yu Mi et al.

**模板摘要 (rule-based, EN):** Preprint (cs.AI, cs.CL); venue acceptance noted: NeurIPS 2026 Workshop: Evaluation of Interactive Agents. Authors propose a new method/framework — novelty not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Benchmarks judge language-model agents mainly by whether they reach the correct final state, not by how they got there. Endpoint scoring cannot separate an agent that retrieved exactly the evidence a decision required from one that read most of the environment, nor an agent that never located the evidence from one that stopped a single action short. Settling this needs a reference cost, and authored solutions establi…

## MMFlash: Faster Speculative Decoding for Vision-Language Models

- 领域 Domain: **多模态/CV** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **66/100** — 相关性 23/25 · 创新证据 10/20 · 代码/权重 15/25 · 可信度 7/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.18482) · [arXiv](https://arxiv.org/abs/2611.18482) · [Code](https://github.com/fscdc/MMFlash) · [Project](https://fscdc.github.io/MMFlash/)
- 信号 Signals: HF papers ▲37
- 作者 Authors: Sicheng Feng, Zigeng Chen, Song Wang, Gongfan Fang, Xinchao Wang

**模板摘要 (rule-based, EN):** Preprint. Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Speculative decoding accelerates generation by letting a lightweight drafter propose tokens for parallel verification by a target model. Diffusion drafters such as DFlash propose an entire token block in a single forward pass, but mainly focus on text-only tasks, leaving multimodal drafting underexplored. To study this setting, we first introduce a metric of token-level visual dependence based on the KL divergence be…

## Open Vision Banana: A Fully Open Recipe for Generative Visual Perception

- 领域 Domain: **多模态/CV** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **66/100** — 相关性 23/25 · 创新证据 10/20 · 代码/权重 15/25 · 可信度 7/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.15844) · [arXiv](https://arxiv.org/abs/2611.15844) · [Code](https://github.com/OpenVisionBanana/OpenVisionBanana) · [Project](https://openvisionbanana.github.io/)
- 信号 Signals: HF papers ▲40
- 作者 Authors: Arpit Jadon, Valentinos Pariza, Jona Ruthardt, Ryousuke Yamada, A. Sophia Koepke, Andrei Bursuc et al.

**模板摘要 (rule-based, EN):** Preprint. Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Recent work suggests that pretrained image generators encode real-world understanding beyond image synthesis. Vision Banana exploits this by framing vision tasks as conditional image editing. However, its data, weights, code, and implementation details are not public. We present Open Vision Banana (OVB), a fully open and reproducible recipe for converting pretrained generators into unified multi-task perception syste…

## Agent-R^2: Scaling Agents for Realistic Productivity Work via Real-Source Data Synthesis

- 领域 Domain: **LLM/Agent** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **65/100** — 相关性 23/25 · 创新证据 10/20 · 代码/权重 15/25 · 可信度 6/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.08219) · [arXiv](https://arxiv.org/abs/2611.08219) · [Code](https://github.com/ZJU-REAL/Agent-R2)
- 信号 Signals: HF papers ▲8
- 作者 Authors: Teng Pan, Zixuan Wang, Yuchen Yan, Qifei Wu, Yao Chen, Yingqi Qu et al.

**模板摘要 (rule-based, EN):** Preprint. Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Large language models have made rapid progress in agentic reasoning and tool use, raising expectations for agents that can take over realistic productivity work from humans. However, current agents still struggle to finish such tasks, where success requires following long-horizon professional workflows, understanding heterogeneous file contexts, and producing usable deliverables under fine-grained requirements. A key…

## ViRA: Toward Ultra-High-Resolution Visual Agents via Cross-Input Relative Policy Optimization

- 领域 Domain: **多模态/CV** | 类型: 论文 paper | 来源: arxiv
- 评分 Score: **64/100** — 相关性 25/25 · 创新证据 10/20 · 代码/权重 15/25 · 可信度 3/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.21605) · [arXiv](https://arxiv.org/abs/2611.21605) · [Code](https://github.com/huawei-lin/ViRA)
- 作者 Authors: Huawei Lin, Jinting Liu, Tongyan Wang, Xuyang Chen, Ruihua Shi, Zhichao Xu et al.

**模板摘要 (rule-based, EN):** Preprint (cs.CV, cs.AI). Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Visual agents answer questions about ultra-high-resolution photos by zooming into the relevant regions. However, existing agents often answer from common sense instead of reading the evidence. Reinforcement learning (RL) on the final answer cannot correct this, because a guess earns the same reward as reading. We propose Cross-Input Relative Policy Optimization (CrossRPO), which trains agents on contrast sets. A cont…

## DySENSE: Dynamic Spatiotemporal ENergy Synthesis and Emulation with Satellite Imagery

- 领域 Domain: **多模态/CV** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **63/100** — 相关性 20/25 · 创新证据 10/20 · 代码/权重 15/25 · 可信度 7/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.17878) · [arXiv](https://arxiv.org/abs/2611.17878) · [Code](https://github.com/kailaisun/DySENSE)
- 信号 Signals: HF papers ▲23
- 作者 Authors: Kailai Sun, Zijie Gao, Mingyi He, Can Rong, Alok Prakash, Baoshen Guo et al.

**模板摘要 (rule-based, EN):** Preprint. Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Cities account for over two-thirds of the world's energy and more than 70% of global carbon dioxide emissions. City energy is essential for achieving the 2050 net-zero target and the UN's Sustainable Development Goals 7 and 11. Although existing studies have made progress, they are limited by data and methodological gaps. Existing studies are largely predictive for existing cities rather than generative for future ci…

## Gamer: A Generalist Vision-Language-Action Foundation Model for Long-Horizon Real-Time Game Agent

- 领域 Domain: **LLM/Agent** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **63/100** — 相关性 25/25 · 创新证据 4/20 · 代码/权重 15/25 · 可信度 8/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.18397) · [arXiv](https://arxiv.org/abs/2611.18397) · [Code](https://github.com/RainBowLuoCS/Gamer) · [Project](https://mihoyo-gamer.github.io/)
- 信号 Signals: HF papers ▲112
- 作者 Authors: Run Luo, Kuan Zhang, Qi Deng, Yukun Chen, Zhihao Yang, Yufei Zhang et al.

**模板摘要 (rule-based, EN):** Preprint. Authors propose a new method/framework — novelty not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): We introduce Gamer, a generalist agent framework built for long-horizon tasks in complex interactive environments. Its end-to-end architecture combines perception, memory management, and multi-step reasoning. A shared training and deployment pipeline supports interaction with both conventional 2D graphical interfaces and complex 3D simulated worlds. We first continue pre-training on a dataset constructed from tens of…

## TTB: Test-time Baking for Efficient Rendering of Decoder-only View Synthesis Models

- 领域 Domain: **多模态/CV** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **63/100** — 相关性 20/25 · 创新证据 10/20 · 代码/权重 15/25 · 可信度 7/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.17331) · [arXiv](https://arxiv.org/abs/2611.17331) · [Code](https://github.com/NVlabs/DVSM) · [Project](https://test-time-baking.github.io/)
- 信号 Signals: HF papers ▲26
- 作者 Authors: Chin-Yang Lin, Ryo Hachiuma, Jaesung Choe, Min-Hung Chen, Yu-Chiang Frank Wang, Yen-Yu Lin et al.

**模板摘要 (rule-based, EN):** Preprint. Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Decoder-only Large View Synthesis Models (LVSMs) with KV-cache have recently achieved state-of-the-art quality by regressing novel views from neural networks without reconstructing 3D geometry, while Test-Time Training (TTT) layers save computation but sacrifice quality. We propose Test-Time Baking (TTB), a strategy that learns to bake global scene information from cross-view attention into a lightweight MLP, enablin…

## Edit Recommendation: Can LLMs Anticipate Edit Requests from Users, and When?

- 领域 Domain: **LLM/Agent** | 类型: 论文 paper | 来源: arxiv
- 评分 Score: **62/100** — 相关性 23/25 · 创新证据 10/20 · 代码/权重 15/25 · 可信度 3/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.21155) · [arXiv](https://arxiv.org/abs/2611.21155) · [Code](https://github.com/ntt-dkiku/llm-edit-recommendation)
- 作者 Authors: Daisuke Kikuta

**模板摘要 (rule-based, EN):** Preprint (cs.CL, cs.AI, cs.HC). Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): After a large language model (LLM) agent generates an artifact, users often send edit requests for it. This paper studies whether an LLM can anticipate these requests before they are sent. Such anticipation is useful in practice because it reduces the effort of user review and feedback. We formalize this task as edit recommendation and build EditRecBench, a benchmark for evaluating the performance of LLMs on this tas…

## ReconPotBench: Evaluating LLM Honeypots in Multi-Round Linux Reconnaissance

- 领域 Domain: **LLM/Agent** | 类型: 论文 paper | 来源: arxiv
- 评分 Score: **62/100** — 相关性 23/25 · 创新证据 10/20 · 代码/权重 15/25 · 可信度 3/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.20528) · [arXiv](https://arxiv.org/abs/2611.20528) · [Code](https://github.com/qianli-wang/ReconPotBench)
- 作者 Authors: Qianli Wang, Junchao Wu, Binkai Ou, Lidia S. Chao, Derek F. Wong

**模板摘要 (rule-based, EN):** Preprint (cs.CR, cs.CL). Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Large language models (LLMs) are increasingly used to build interactive honeypots, yet existing evaluations mainly assess isolated command outputs and cannot determine whether a system remains believable when later commands depend on earlier results. We present ReconPotBench, a multi-round benchmark for Linux reconnaissance honeypots. It contains 1{,}032 three-round reconnaissance interactions across eight reconnaiss…

## 数据源状态 Source status

- ✅ arXiv: 332 items
- ✅ HF Papers: 100 items
- ✅ HF Models: 30 items
- ✅ GitHub trending/search/new: 187 items
- ✅ Hacker News: 30 items
- ✅ Institution RSS: 13 items
---
*Generated 2026-11-17 14:17 UTC by [ai-research-radar](https://github.com/Yaozitian0/ai-research-radar) — 规则评分 + 模板摘要,零 LLM、零付费 API。正文保留英文原文,未翻译。*
