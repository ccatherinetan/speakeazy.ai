const express = require("express");
const http = require("http");
require("dotenv").config();
const { HumeClient } = require("hume"); // Ensure the HumeClient supports binary data over WebSockets

const app = express();
const server = http.createServer(app);
const WebSocket = require("ws"); // For handling WebSocket without HumeClient, if needed

const hume = new HumeClient({
  apiKey: process.env.HUME_API_KEY,
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");

  const socket = hume.expressionMeasurement.stream.connect({
    onOpen: () => console.log("WebSocket connection to Hume AI opened"),
    onMessage: handleMessage,
    onError: (error) => console.error("WebSocket error:", error),
    onClose: () => console.log("WebSocket connection closed"),
  });

  function handleMessage(message) {
    console.log("Message from Hume AI:", message);
    // Handle messages here
  }

  // Setup a WebSocket server to receive video from the client
  const wsServer = new WebSocket.Server({ server });
  wsServer.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
      if (typeof message === "string") {
        console.log("Received text:", message);
      } else {
        // Assuming binary data is video
        console.log("Received video data.");
        console.log(message);
        // Send this data to Hume's WebSocket
        socket.sendVideo(message); // This method must exist or be implemented in HumeClient
      }
    });
  });

  // Inform clients the server is ready
  app.get("/", (req, res) => {
    res.send("Server is ready to receive video!");
  });
});
