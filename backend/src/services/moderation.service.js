import axios from "axios";

// Analyzes text toxicity using Google's Perspective API
// Returns a score between 0-1 (higher = more toxic)
export const analyzeToxicity = async (text) => {
  try {
    // Guard: Perspective API requires non-empty text
    if (!text || text.trim().length === 0) {
      return 0.1; // treat empty as neutral, let controller validation catch it
    }

    // Call Perspective API to analyze toxicity
    const response = await axios.post(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
      {
        comment: { text },
        // Explicitly declare language — required by Perspective API for non-empty requests
        languages: ["en"],
        requestedAttributes: {
          TOXICITY: {}
        }
      },
      // Timeout so a slow API call doesn't block review creation indefinitely
      { timeout: 8000 }
    );

    // Extract toxicity score from response
    const score =
      response.data.attributeScores.TOXICITY.summaryScore.value;

    return score;

  } catch (error) {
    // Log full response body so we can see exactly what Perspective API rejected
    const detail = error.response?.data?.error?.message || error.message;
    const status = error.response?.status ?? "network error";
    console.error(`Perspective API Error [${status}]: ${detail} — falling back to PENDING`);

    // Fail-safe: the review is still created, but lands in PENDING for manual moderation
    return 0.1;
  }
};
