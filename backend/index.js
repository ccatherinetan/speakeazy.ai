const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000; // Default to port 3000 if PORT environment variable is not set

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("Received message:", message);

    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: message,
        max_tokens: 150,
        temperature: 0.9,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: ["\n", " Human:", " AI:"],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log("OpenAI response:", response.data);

    res.json({ reply: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error communicating with ChatGPT:", error.message);
    res.status(500).send("Error communicating with ChatGPT");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Environment variables:", process.env); // Log all environment variables for verification
});
