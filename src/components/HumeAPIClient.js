// HumeAPIClient.js

const API_BASE_URL = "https://api.hume.ai/v0";

export const startInferenceJob = async (apiKey, models, urls) => {
  try {
    const response = await fetch(`${API_BASE_URL}/batch/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hume-Api-Key": apiKey,
      },
      body: JSON.stringify({
        models,
        urls,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to start inference job");
    }

    const data = await response.json();
    return data.job_id;
  } catch (error) {
    console.error("Error starting inference job:", error);
    throw error;
  }
};

export const getJobPredictions = async (apiKey, jobId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/batch/jobs/${jobId}/predictions`,
      {
        method: "GET",
        headers: {
          "X-Hume-Api-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch job predictions");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching job predictions:", error);
    throw error;
  }
};
