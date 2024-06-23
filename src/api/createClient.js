import { HumeClient } from "hume";

// need to add security checks 
const hume = new HumeClient({ apiKey: process.env.REACT_APP_HUME_API_KEY });

export default hume;