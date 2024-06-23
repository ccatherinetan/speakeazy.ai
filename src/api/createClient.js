import { HumeClient } from "hume";

// need to add security checks?  
if (!process.env.REACT_APP_HUME_API_KEY) throw new Error('No Hume environment variables detected.')
const humeClient = new HumeClient({ apiKey: process.env.REACT_APP_HUME_API_KEY });

export default humeClient;