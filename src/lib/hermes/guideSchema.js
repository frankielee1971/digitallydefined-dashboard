/**
 * JSON schema for structured Hermes guide output.
 *
 * The model must return a JSON object matching this schema.
 * Used with structured output / JSON mode to ensure parseable responses.
 *
 * Root must be an object with these exact fields.
 */

export const guideSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Short, specific guide title based on their quiz result",
    },
    summary: {
      type: "string",
      description: "2-3 sentence overview of what this guide covers and why it matters for them",
    },
    firstAsset: {
      type: "string",
      description: "The single best first digital asset for them to create, with a brief rationale",
    },
    firstSteps: {
      type: "array",
      items: { type: "string" },
      description: "3-5 concrete first steps to take this week",
    },
    recommendedPath: {
      type: "string",
      description: "The broader digital real estate path that fits their strengths (creator, builder, educator, connector, or strategist)",
    },
    nextMilestone: {
      type: "string",
      description: "One clear milestone to aim for in the next 30 days",
    },
    encouragement: {
      type: "string",
      description: "A short, specific encouragement tied to their quiz result — no generic hype",
    },
  },
  required: [
    "title",
    "summary",
    "firstAsset",
    "firstSteps",
    "recommendedPath",
    "nextMilestone",
    "encouragement",
  ],
  additionalProperties: false,
};

export default guideSchema;