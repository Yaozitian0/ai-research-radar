import { describe, it, expect } from "vitest";
import { classify, isAiRepoText } from "../radar/domains.ts";

describe("classify", () => {
  it("routes LLM/agent work to llm-agent", () => {
    const c = classify(
      "Efficient Tool Use for LLM Agents",
      "We study agentic tool use in large language models.",
      ["cs.CL"],
    );
    expect(c.primaryDomain).toBe("llm-agent");
  });

  it("routes reinforcement learning to rl", () => {
    const c = classify(
      "Offline Reinforcement Learning with Policy Gradients",
      "We propose a new policy optimization method for offline RL.",
      ["cs.LG"],
    );
    expect(c.primaryDomain).toBe("rl");
  });

  it("routes retrieval/RAG to rag-nlp", () => {
    const c = classify(
      "Dense Retrieval for Retrieval-Augmented Generation",
      "We improve passage retrieval and reranking for RAG question answering.",
      ["cs.IR"],
    );
    expect(c.primaryDomain).toBe("rag-nlp");
  });

  it("routes vision/multimodal to multimodal-cv", () => {
    const c = classify(
      "Diffusion Models for Video Segmentation",
      "A multimodal vision approach to image and video segmentation.",
      ["cs.CV"],
    );
    expect(c.primaryDomain).toBe("multimodal-cv");
  });

  it("falls back to ai-general for generic ML", () => {
    const c = classify("Improved Optimization for Neural Network Training", "Convergence analysis.", [
      "cs.LG",
    ]);
    expect(c.primaryDomain).toBe("ai-general");
  });

  it("falls back to ai-general with no signal at all", () => {
    const c = classify("Untitled", "", []);
    expect(c.domains).toEqual(["ai-general"]);
    expect(c.primaryDomain).toBe("ai-general");
  });

  it("is deterministic on ties", () => {
    const a = classify("LLM RL", "", []);
    const b = classify("LLM RL", "", []);
    expect(a).toEqual(b);
  });
});

describe("isAiRepoText", () => {
  it("accepts AI repos", () => {
    expect(isAiRepoText("lab/llm-toolkit", "A toolkit for large language model inference")).toBe(true);
    expect(isAiRepoText("lab/agent-fw", "Autonomous agent framework")).toBe(true);
  });

  it("rejects unrelated repos", () => {
    expect(isAiRepoText("cook/recipes", "My cooking recipe collection")).toBe(false);
    expect(isAiRepoText("dev/dotfiles", "Personal configuration files")).toBe(false);
  });
});
