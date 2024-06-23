// src/components/WebcamCapture.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const WebcamCapture = () => {
  const [socket, setSocket] = useState(null);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    const humeSocket = io("wss://api.hume.ai/v0/stream/models", {
      auth: {
        token: process.env.REACT_APP_HUME_API_KEY,
      },
    });

    setSocket(humeSocket);

    return () => {
      if (humeSocket) {
        humeSocket.disconnect();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setStream(userMedia);
      setRecording(true);

      // Send media stream to Hume AI via WebSocket
      if (socket) {
        socket.emit("start_stream", { type: "media" });
        userMedia.getTracks().forEach((track) => {
          socket.emit("stream_data", { type: track.kind, stream: track });
        });
      }
    } catch (error) {
      console.error("Error accessing user media:", error);
      // Handle error (e.g., display error message to user)
    }
  };

  const stopRecording = () => {
    if (socket) {
      socket.emit("stop_stream");
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setRecording(false);
    }
  };

  return (
    <div>
      <h2>Webcam Capture</h2>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
    </div>
  );
};

export default WebcamCapture;
