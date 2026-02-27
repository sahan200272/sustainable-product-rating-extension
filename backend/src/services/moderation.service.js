import axios from "axios";

// Analyzes text toxicity using Google's Perspective API
// Returns a score between 0-1 (higher = more toxic)
export const analyzeToxicity = async (text) => {
  try {
    // Call Perspective API to analyze toxicity
    const response = await axios.post(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
      {
        comment: { text },
        requestedAttributes: {
          TOXICITY: {}
        }
      }
    );

    // Extract toxicity score from response
    const score =
      response.data.attributeScores.TOXICITY.summaryScore.value;

    return score;

  } catch (error) {
    console.error("Perspective API Error:", error.message);
    throw new Error("Moderation service failed");
  }
};