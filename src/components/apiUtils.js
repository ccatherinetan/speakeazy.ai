// apiUtils.js

const startInferenceJob = async (humeApiKey, audioBlob, videoBlob) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const videoUrl = URL.createObjectURL(videoBlob);

  const requestBody = {
    models: {}, // Fill with specific models and settings
    urls: [audioUrl, videoUrl], // Pass the URLs of audio and video blobs
    // Add other parameters as needed based on your requirements
  };

  try {
    const response = await fetch("https://api.hume.ai/v0/batch/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hume-Api-Key": humeApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to start inference job");
    }

    const responseData = await response.json();
    console.log("Job started successfully:", responseData);
    return responseData.job_id; // Return the job ID for future reference
  } catch (error) {
    console.error("Error starting inference job:", error);
  }
};

const getJobPredictions = async (humeApiKey, jobId) => {
  const predictionsUrl = `https://api.hume.ai/v0/batch/jobs/${jobId}/predictions`;

  try {
    const response = await fetch(predictionsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Hume-Api-Key": humeApiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get job predictions");
    }

    const predictions = await response.json();
    console.log("Predictions:", predictions);
    return predictions;
  } catch (error) {
    console.error("Error getting job predictions:", error);
  }
};

export { startInferenceJob, getJobPredictions };
