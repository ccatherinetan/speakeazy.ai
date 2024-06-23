const express = require("express");
const WebSocket = require("ws");
const http = require("http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const HUME_API_KEY = process.env.HUME_API_KEY; // Ensure your .env file contains this key
const HUME_SOCKET_ENDPOINT = "wss://api.hume.ai/v0/stream/models";

// Proxy WebSocket server
const proxyWs = new WebSocket.Server({ server, path: "/proxy" });

proxyWs.on("connection", function connection(ws) {
  const humeWs = new WebSocket(HUME_SOCKET_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${HUME_API_KEY}`,
    },
  });
  console.log(`Using API Key: ${HUME_API_KEY}`);

  humeWs.on("open", () => {
    console.log("Connected to Hume AI");
  });

  humeWs.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  humeWs.on("close", (code, reason) => {
    console.log(`WebSocket closed with code: ${code}, reason: ${reason}`);
  });

  humeWs.on("unexpected-response", (request, response) => {
    console.error(`Unexpected response: ${response.statusCode}`);
  });

  // humeWs.on("error", (error) => {
  //   console.error("WebSocket error:", error);
  //   ws.close();
  // });
});

server.listen(3001, () => {
  console.log("WebSocket proxy server running on http://localhost:3001");
});
