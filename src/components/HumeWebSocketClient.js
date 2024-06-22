// src/components/HumeWebSocketClient.js
import React, { useEffect } from "react";
import io from "socket.io-client";

const HumeWebSocketClient = () => {
  useEffect(() => {
    // Replace with your actual WebSocket endpoint from Hume
    const socket = io("wss://api.hume.ai/v0/stream/models", {
      auth: {
        token: process.env.REACT_APP_HUME_API_KEY,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to Hume WebSocket");

      // Example JSON message to send
      const message = {
        models: {
          language: {},
        },
        raw_text: true,
        data: "Mary had a little lamb",
      };

      socket.emit("message", message);
    });

    socket.on("data", (data) => {
      console.log("Received data from Hume:", data);
      // Handle incoming data (language predictions, emotions, etc.)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Hume WebSocket Client</div>;
};

export default HumeWebSocketClient;
