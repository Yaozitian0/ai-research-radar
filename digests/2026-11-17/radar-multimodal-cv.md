# 📚 多模态/CV 领域日报 (Multimodal/CV) — 2026-11-17

> 生成时间: 2026-11-17 14:17 UTC | 本领域候选 237 条,展示前 12 条
> 摘要为规则模板生成,标题与摘录保留英文原文(未翻译)。缺代码/权重/实验已标注,创新声明未验证。

## [CLS] and [EOS] Tokens are not Enough for CLIP-based Class-Incremental Learning

- 领域 Domain: **多模态/CV** | 类型: 论文 paper | 来源: arxiv
- 评分 Score: **73/100** — 相关性 20/25 · 创新证据 20/20 · 代码/权重 15/25 · 可信度 7/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply))
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.21440) · [arXiv](https://arxiv.org/abs/2611.21440) · [Code](https://github.com/LAMDA-CL/PACE)
- 作者 Authors: Hao Sun, Tao Hu, Shixiong Kai, Siyuan Xu, Wenqian Zhao, Mingxuan Yuan et al.

**模板摘要 (rule-based, EN):** Preprint (cs.CV); venue acceptance noted: acceptance noted in arXiv comment (venue not parsed). Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Class-Incremental Learning (CIL) aims to empower models to continuously acquire new knowledge while mitigating catastrophic forgetting. With the advent of vision-language models like CLIP, leveraging their cross-modal alignment capabilities to address CIL challenges has emerged as a dominant paradigm. Existing methods leverage CLIP's global representations (i.e., the visual [CLS] token and the textual [EOS] token) fo…

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

## A frontier machine intelligence for human neuroimaging

- 领域 Domain: **AI 全领域** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **62/100** — 相关性 24/25 · 创新证据 6/20 · 代码/权重 15/25 · 可信度 6/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.15094) · [arXiv](https://arxiv.org/abs/2611.15094) · [Code](https://github.com/MLNeurosurg/neuro-vl) · [Project](https://neurovl.mlins.org/)
- 信号 Signals: HF papers ▲4
- 作者 Authors: Chenhui Zhao, Akshay Rao, Akhil Kondepudi, Yiwei Lyu, Xinhai Hou, Rikhil Seshadri et al.

**模板摘要 (rule-based, EN):** Preprint. Authors claim state-of-the-art or superior results — claim not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Medical imaging is essential for diagnosing disease, guiding treatment and monitoring patients over time. Although artificial intelligence has advanced image interpretation, existing medical models often address restricted tasks, while general-purpose proprietary models lack access to private clinical imaging required to achieve medical expertise. Developing models that can interpret complex examinations and communic…

## LynnReal-Hand: Unlocking World Interaction with Hand Control

- 领域 Domain: **多模态/CV** | 类型: 论文 paper | 来源: arxiv, hf-papers
- 评分 Score: **61/100** — 相关性 16/25 · 创新证据 4/20 · 代码/权重 25/25 · 可信度 5/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.21479) · [arXiv](https://arxiv.org/abs/2611.21479) · [Code](https://github.com/LynnReal-AI/LynnReal) · [Project](https://github.com/LynnReal-AI/LynnReal)
- 信号 Signals: HF papers ▲1
- 作者 Authors: Shaohao Rui, Chaoyang Zhang, Xiaofeng Mao, Weijie Ma

**模板摘要 (rule-based, EN):** Preprint (cs.CV, cs.AI). Authors propose a new method/framework — novelty not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Interactive video world models enable exploration through text and camera controls, yet direct object interaction requires finer control. Hands provide a natural interface, but translating continuous hand movements into coherent visual responses remains challenging because of complex hand-object dynamics and demanding real-time computation. To address these challenges, we introduce LynnReal-Hand, a hand-controlled vi…

## Ropedia Xperience 2: A Gold Standard for Scaling Physical AI Environments and Behaviors

- 领域 Domain: **LLM/Agent** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **61/100** — 相关性 24/25 · 创新证据 4/20 · 代码/权重 15/25 · 可信度 7/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.17060) · [arXiv](https://arxiv.org/abs/2611.17060) · [Code](https://github.com/Ropedia/Ropedia-Xperience-2) · [Project](https://ropedia.com/xperience/2-research/)
- 信号 Signals: HF papers ▲35
- 作者 Authors: Hao Li, Fangzhou Hong, Zhaoxi Chen, Hui En Pang, Kairui Hu, Mingze Sun et al.

**模板摘要 (rule-based, EN):** Preprint. Authors propose a new method/framework — novelty not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Large foundation models such as GPT-6 Astra and Claude Fable 5.1 have recently been shown to control robots directly from visual observations. They nevertheless remain brittle on long-horizon, contact-rich tasks in real-world environments. Further progress depends on two complementary resources: demonstrations of human behavior that supervise how tasks are performed, and interactive environments in which policies can…

## VibePrevisBench: Evaluating Agentic Coding for 4D Scene Generation in Blender

- 领域 Domain: **LLM/Agent** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **61/100** — 相关性 23/25 · 创新证据 4/20 · 代码/权重 15/25 · 可信度 8/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.15789) · [arXiv](https://arxiv.org/abs/2611.15789) · [Code](https://github.com/vibeprevisbench/vibeprevisbench) · [Project](https://vibeprevisbench.github.io/)
- 信号 Signals: HF papers ▲88
- 作者 Authors: Yuzhe Chen, Muxi Diao, Lele Yang, Wenbin Xu, Xuyang Liu, Qile Su et al.

**模板摘要 (rule-based, EN):** Preprint. Authors propose a new method/framework — novelty not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): Controllable real-world video generation models can condition on a rendered graybox proxy video, which fixes layout, motion and camera. Coding agents can build such videos by reconstructing a 4D scene in Blender, yet no benchmark checks both these videos and the long, multi-shot scenes behind them. We introduce VibePrevisBench, a benchmark for 4D scene reconstruction: an agent turns a brief into an executable 4D scen…

## HiVe-Mem: Interleaving Horizontal Memory Expansion and Vertical Evidence Composition for Multimodal Agents

- 领域 Domain: **多模态/CV** | 类型: 论文 paper | 来源: hf-papers
- 评分 Score: **61/100** — 相关性 25/25 · 创新证据 4/20 · 代码/权重 15/25 · 可信度 6/15 · 可复现 11/15
- 标注 Flags: ⚠ 未找到模型权重(可能不适用) (no weights found (may not apply)) · ⚠ 创新性声明未验证 (novelty/SOTA claims unverified)
- 链接 Links: [原文/Source](https://arxiv.org/abs/2611.12872) · [arXiv](https://arxiv.org/abs/2611.12872) · [Code](https://github.com/ViktorAxelsen/HiVe-Mem) · [Project](https://viktoraxelsen.github.io/HiVe-Mem/)
- 信号 Signals: HF papers ▲4
- 作者 Authors: Haozhen Zhang, Bohan Liu, Jianzhu Bao, Qingyuan Liu, Haodong Yue, Xiao Li et al.

**模板摘要 (rule-based, EN):** Preprint. Authors propose a new method/framework — novelty not independently verified. code available; no weights link found. Abstract mentions experiments/evaluation.

> 原文摘录 (English original, not translated): As multimodal agents accumulate increasingly long interaction histories, effectively retrieving and utilizing past information becomes critical for long-term interaction. Existing memory systems typically rely on semantic retrieval over compressed memories and expose predefined representations, which may miss relevant memories and overlook heterogeneous evidence needs across queries. We introduce \hivemem, a multimod…

## 数据源状态 Source status

- ✅ arXiv: 332 items
- ✅ HF Papers: 100 items
- ✅ HF Models: 30 items
- ✅ GitHub trending/search/new: 187 items
- ✅ Hacker News: 30 items
- ✅ Institution RSS: 13 items
---
*Generated 2026-11-17 14:17 UTC by [ai-research-radar](https://github.com/Yaozitian0/ai-research-radar) — 规则评分 + 模板摘要,零 LLM、零付费 API。正文保留英文原文,未翻译。*
