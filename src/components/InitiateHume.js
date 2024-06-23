import {startInferenceJob, getJobPredictions} from '../../src/api/queries';

export default function InitiateHume() {
    const logResults = () => {
        const { job_id } = startInferenceJob("https://hume-tutorials.s3.amazonaws.com/faces.zip")
        console.log(getJobPredictions(job_id));
    }
    return <button onClick={logResults()}>Initiate Hume Test</button>;
};