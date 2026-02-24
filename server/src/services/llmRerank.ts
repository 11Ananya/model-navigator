/**
 * LLM-powered reranking service
 *
 * When a user provides a use-case description, Claude re-ranks the filtered
 * model candidates and rewrites the reasoning for each to be specific to
 * what the user described.
 *
 * Scoring: 60% deterministic score + 40% LLM fit score — keeps rankings
 * grounded while incorporating use-case context.
 */

import { anthropic } from "../lib/claude.js";
import type { ModelRecommendation, RecommendationConfig } from "./recommend.js";

interface LlmRanking {
  id: string;
  fitScore: number; // 0–100 from Claude
  reasoning: string; // rewritten for this specific use case
}

export async function llmRerank(
  candidates: ModelRecommendation[],
  warningModel: ModelRecommendation,
  config: RecommendationConfig
): Promise<{
  primary: ModelRecommendation;
  alternatives: ModelRecommendation[];
  warning: ModelRecommendation;
}> {
  const systemPrompt = `You are an ML infrastructure advisor specializing in open-source model selection.
Given a list of candidate models and a user's described use case, you must:
1. Re-rank the models by how well they fit the described use case
2. Rewrite the reasoning for each model to be specific and useful for this exact use case
3. Return ONLY valid JSON — no markdown, no explanation outside the JSON

Be practical and honest. Mention specific strengths or risks relevant to the use case.`;

  const userPrompt = `Use case description: "${config.useCaseDescription}"

Additional constraints:
- Task type: ${config.taskType}
- Deployment target: ${config.deploymentTarget}
- Inference framework: ${config.inferenceFramework}
- Quantization: ${config.quantization}
- GPU memory: ${config.gpuMemory}
- Max latency: ${config.maxLatency}ms

Candidate models to re-rank:
${JSON.stringify(
  candidates.map((m) => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    parameters: m.parameters,
    memoryRequired: m.memoryRequired,
    latency: m.latency,
    license: m.license,
    baseScore: m.score,
    currentReasoning: m.reasoning,
    tradeoffs: m.tradeoffs,
  })),
  null,
  2
)}

Return a JSON array with one object per model, ordered from best to worst fit for the described use case:
[
  {
    "id": "<model id>",
    "fitScore": <0-100 integer, how well this model fits the described use case>,
    "reasoning": "<2-3 sentence explanation specific to the user's use case — practical, not generic>"
  }
]`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    temperature: 0,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const rawText =
    message.content[0].type === "text" ? message.content[0].text : "";

  let rankings: LlmRanking[];
  try {
    // Strip any accidental markdown fences
    const cleaned = rawText.replace(/```(?:json)?/g, "").trim();
    rankings = JSON.parse(cleaned);
  } catch {
    // If Claude returns malformed JSON, fall back to original ordering
    console.error("[llmRerank] Failed to parse LLM response, using original order");
    return {
      primary: candidates[0],
      alternatives: candidates.slice(1, 3),
      warning: warningModel,
    };
  }

  // Build a lookup of LLM scores by model id
  const llmScoreMap = new Map<string, LlmRanking>(
    rankings.map((r) => [r.id, r])
  );

  // Blend: 60% deterministic base score + 40% LLM fit score
  const blended = candidates.map((model) => {
    const llm = llmScoreMap.get(model.id);
    const blendedScore = llm
      ? Math.round(model.score * 0.6 + llm.fitScore * 0.4)
      : model.score;
    const reasoning = llm?.reasoning ?? model.reasoning;
    return { ...model, score: blendedScore, reasoning };
  });

  // Sort by blended score descending
  blended.sort((a, b) => b.score - a.score);

  // Rewrite warning model reasoning too if Claude ranked it
  const llmWarning = llmScoreMap.get(warningModel.id);
  const finalWarning = llmWarning
    ? { ...warningModel, reasoning: llmWarning.reasoning }
    : warningModel;

  return {
    primary: blended[0],
    alternatives: blended.slice(1, 3),
    warning: finalWarning,
  };
}
