const express = require("express");
const WebSocket = require("ws");
const http = require("http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Retrieve API Key from environment variables
const HUME_API_KEY = process.env.HUME_API_KEY;
const HUME_SOCKET_ENDPOINT = "wss://api.hume.ai/v0/stream/models";

// Create a WebSocket Server on top of the HTTP server
const proxyWs = new WebSocket.Server({ server, path: "/proxy" });

console.log("Using HUME API KEY:", HUME_API_KEY); // Debugging: log the API key to verify it's loaded correctly

proxyWs.on("connection", function connection(ws) {
  let humeWs;
  let connectionAttempts = 0;

  function connectToHume() {
    if (connectionAttempts > 3) {
      console.log("Maximum connection attempts reached.");
      ws.send(
        JSON.stringify({
          error: "Failed to connect to Hume AI after several attempts.",
        })
      );
      ws.close(1011, "Unable to connect to Hume AI after several attempts.");
      return;
    }

    humeWs = new WebSocket(HUME_SOCKET_ENDPOINT, {
      headers: {
        "X-Hume-Api-Key": HUME_API_KEY,
      },
    });

    humeWs.on("open", () => {
      console.log("Connected to Hume AI");
      connectionAttempts = 0; // Reset attempts on successful connection
    });

    humeWs.on("message", (data) => {
      console.log("Raw data received from Hume AI:", data);
      try {
        const jsonData = JSON.parse(data);
        console.log("Parsed predictions:", jsonData);
        ws.send(
          JSON.stringify({
            type: "predictions",
            data: jsonData,
          })
        ); // Forward processed data to the client
      } catch (error) {
        console.error("Error parsing JSON from Hume AI:", error);
      }
    });

    humeWs.on("close", (code, reason) => {
      console.log(
        `Hume WebSocket closed with code: ${code}, reason: ${reason}`
      );
      ws.close(); // Close client WebSocket if Hume WebSocket closes
      connectionAttempts++;
      setTimeout(connectToHume, 1000 * connectionAttempts); // Exponential back-off
    });

    humeWs.on("error", (error) => {
      console.error("WebSocket error from Hume:", error);
    });

    humeWs.on("unexpected-response", (request, response) => {
      console.error(`Unexpected response from Hume: ${response.statusCode}`);
      ws.close(); // Close client WebSocket on unexpected response
    });
  }

  ws.on("message", (message) => {
    console.log("Received message from client:", message);
    if (humeWs && humeWs.readyState === WebSocket.OPEN) {
      humeWs.send(message);
    } else {
      console.log("Hume WebSocket is not open. Attempting to connect...");
      connectToHume();
    }
  });

  ws.on("close", () => {
    console.log("Client WebSocket closed");
    if (humeWs) {
      humeWs.close(); // Ensure to close the Hume WebSocket when client disconnects
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error from client:", error);
    if (humeWs) {
      humeWs.close(); // Ensure to close the Hume WebSocket on client error
    }
  });

  connectToHume();
});

server.listen(3001, () => {
  console.log("WebSocket proxy server running on http://localhost:3001");
});
