import express from "express";
import http from "http";
import WebSocket, { Server } from "ws";
import cors from "cors";
import dotenv from "dotenv";
import { HumeClient } from "hume";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const server = http.createServer(app);

const hume = new HumeClient({
  apiKey: process.env.HUME_API_KEY,
});

console.log("Using HUME API KEY:", process.env.HUME_API_KEY);

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");

  const socket = hume.expressionMeasurement.stream.connect({
    onOpen: () => console.log("WebSocket connection to Hume AI opened"),
    onMessage: handleMessage,
    onError: (error) => console.error("WebSocket error:", error),
    onClose: () => console.log("WebSocket connection closed"),
  });

  function handleMessage(message: any) {
    console.log("Message from Hume AI:", message);
  }

  const wsServer = new Server({ server, path: "/video" });

  wsServer.on("connection", (ws: WebSocket) => {
    console.log("Client connected to /video WebSocket endpoint");

    ws.on("message", async (message: WebSocket.Data) => {
      if (typeof message === "string") {
        console.log("Received text:", message);
      } else {
        console.log("Received video data.");

        const base64Message = Buffer.from(message).toString("base64");

        try {
          console.log("Sending video data to Hume AI...");
          const result = await socket.sendFile(
            Buffer.from(base64Message, "base64")
          );
          console.log("Prediction result from Hume:", result);
          ws.send(JSON.stringify(result)); // Send result back to client
        } catch (error) {
          console.error("Error sending video to Hume:", error);
        }
      }
    });

    ws.on("close", () => {
      console.log("Client WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error from client:", error);
    });
  });

  app.get("/", (req, res) => {
    res.send("Server is ready to receive video!");
  });
});
