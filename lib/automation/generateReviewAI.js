export async function generateReviewAI(body) {
  const apiKey = process.env.GEMINI_API_KEY;
  const reviewText =
    body.review_text || body["Review Text"] || "";
  const customerName =
    body.prospect_name || body["Customer Name"] || "";
  const rating = body.rating || body["Star Rating"] || "";

  const prompt = `
You are a review analysis assistant. Analyze the following review submission and return ONLY a valid JSON object with exactly three keys: sentiment (positive, neutral, or negative), draft_response (a suggested public reply to the review), and internal_note (an internal team note about this review).

Customer Name: ${customerName}
Star Rating: ${rating}
Review Text: ${reviewText}
`;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = {
      sentiment: "neutral",
      draft_response: "Thank you for your review.",
      internal_note: "AI parsing failed; default response used.",
    };
  }

  return parsed;
}
