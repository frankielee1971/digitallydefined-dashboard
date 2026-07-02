/**
 * Normalizes raw quiz/profile payloads into a clean input object for Hermes guide generation.
 *
 * This helper is defensive: it handles missing values safely and does not
 * invent business logic beyond what the app already implies.
 *
 * @param {Object} raw - Raw payload from the frontend
 * @param {string} [raw.resultKey] - Quiz result key (creator, builder, educator, connector, strategist)
 * @param {string} [raw.resultTitle] - Human-readable result title
 * @param {Object} [raw.answers] - Quiz answers map (questionId -> value)
 * @param {Object} [raw.contact] - Contact info (name, email)
 * @param {Object} [raw.profile] - Optional profile data
 * @returns {Object} Normalized context object for Hermes
 */

export function buildGuideInput(raw = {}) {
  if (!raw || typeof raw !== "object") {
    return { resultKey: null, resultTitle: null, answers: {}, contact: {}, profile: {} };
  }

  const resultKey = typeof raw.resultKey === "string" ? raw.resultKey : null;
  const resultTitle = typeof raw.resultTitle === "string" ? raw.resultTitle : null;

  const answers = raw.answers && typeof raw.answers === "object" ? { ...raw.answers } : {};

  const contact = raw.contact && typeof raw.contact === "object" ? { ...raw.contact } : {};
  const safeContact = {
    name: typeof contact.name === "string" ? contact.name : null,
    email: typeof contact.email === "string" ? contact.email : null,
  };

  const profile = raw.profile && typeof raw.profile === "object" ? { ...raw.profile } : {};

  return {
    resultKey,
    resultTitle,
    answers,
    contact: safeContact,
    profile,
  };
}

/**
 * Example request payload shape:
 *
 * POST /api/hermes-guide
 * {
 *   "resultKey": "creator",
 *   "resultTitle": "The Content Creator",
 *   "answers": { "1": "creator", "2": "creator", "3": "creator" },
 *   "contact": { "name": "Jane", "email": "jane@example.com" },
 *   "profile": { "experience": "beginner", "timePerWeek": "5-10 hours" }
 * }
 */

export default buildGuideInput;