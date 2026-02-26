import axios from "axios";

export const analyzeToxicity = async (text) => {
  try {
    const response = await axios.post(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
      {
        comment: { text },
        requestedAttributes: {
          TOXICITY: {}
        }
      }
    );

    const score =
      response.data.attributeScores.TOXICITY.summaryScore.value;

    return score;

  } catch (error) {
    console.error("Perspective API Error:", error.message);
    throw new Error("Moderation service failed");
  }
};