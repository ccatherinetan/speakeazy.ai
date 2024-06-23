import humeClient from './createClient';

// returns a json object containing job_id, i.e. {"job_id": job_id}
export async function startInferenceJob(url) {
    const result = await humeClient.expressionMeasurement.batch.startInferenceJob({
        urls: [url], // e.g. "https://hume-tutorials.s3.amazonaws.com/faces.zip"
        notify: true
    });
    return result;
}

// see documentation https://dev.hume.ai/reference/expression-measurement-api/batch/get-job-details
export async function getJobDetails(job_id) {
    const result = await humeClient.expressionMeasurement.batch.getJobDetails(job_id);
    return result; 
}

// returns an array of predictions (json) for each file 
export async function getJobPredictions(job_id) {
    const result = await humeClient.expressionMeasurement.batch.getJobPredictions(job_id);
    if (result.results.errors.message) {
        throw new Error("Error while getting prediction results for job_id: " + job_id);
    }
    return result.results.predictions; 
}