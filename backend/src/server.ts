import express from "express";
import http from "http";
import { Server as WebSocketServer, WebSocket } from "ws";
import { HumeClient } from "hume";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server, path: "/video" });

const hume = new HumeClient({
  apiKey: process.env.HUME_API_KEY,
  secretKey: process.env.HUME_SECRET_KEY,
});

// Function to safely stringify objects with circular references
function safeStringify(obj: any) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our set
      cache.add(value);
    }
    return value;
  });
}

wsServer.on("connection", (ws: WebSocket) => {
  console.log("Client connected to /video WebSocket endpoint");

  ws.on("message", async (message: Buffer) => {
    try {
      console.log("Received frame from client");

      // Assuming this method initializes the connection and processes the data
      const result = await hume.expressionMeasurement.stream.connect(
        data: message.toString("base64"),
      );

      console.log("Prediction result from Hume:", safeStringify(result));
      ws.send(safeStringify(result));
    } catch (error) {
      console.error("Error processing frame:", error);
      ws.send(JSON.stringify({ error: "Error processing frame" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected from /video WebSocket endpoint");
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
