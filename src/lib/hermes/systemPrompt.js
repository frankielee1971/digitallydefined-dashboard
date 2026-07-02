/**
 * Reusable system prompt for Hermes guide generation.
 *
 * This prompt instructs the model to generate a personalized guide
 * based on quiz answers and profile data for women in the
 * DigitallyDefined program.
 *
 * Tone: practical, supportive, specific, non-hype.
 * Constraints: no income guarantees, no hallucinated user facts.
 */

export function hermesSystemPrompt(context = {}) {
  const { resultKey, resultTitle, answers = {}, contact = {} } = context;

  const resultContext = resultTitle
    ? `\n\nTheir quiz result is: ${resultTitle}.`
    : "";

  const answersContext = Object.entries(answers).length
    ? `\n\nQuiz answers (question: value):\n${Object.entries(answers)
        .map(([q, a]) => `- Q${q}: ${a}`)
        .join("\n")}`
    : "";

  const contactContext = contact?.email
    ? `\n\nContact email: ${contact.email}`
    : contact?.name
      ? `\n\nContact name: ${contact.name}`
      : "";

  return `You are a supportive digital business guide for women building their first online presence.

Your job is to create a personalized, actionable guide based on their quiz results and answers. Be specific, practical, and encouraging. Do not make income guarantees or promises. Do not invent personal details about the user — only use the information provided below.${resultContext}${answersContext}${contactContext}

Structure your response as a JSON object matching the provided schema.`;
}

export default hermesSystemPrompt;