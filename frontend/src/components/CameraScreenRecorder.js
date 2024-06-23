import React, { useRef, useState, useEffect, useContext } from "react";
import { useWebSocket } from "./WebSocketContext"; // Import the WebSocket custom hook

const CameraScreenRecorder = () => {
  const ws = useWebSocket(); // Get WebSocket connection from context
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ action: "startCamera", status: "Camera started" })
        );
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({ action: "stopCamera", status: "Camera stopped" })
      );
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: 300, height: 300 }} />
      <button onClick={isCameraOn ? stopCamera : startCamera}>
        {isCameraOn ? "Stop Camera" : "Start Camera"}
      </button>
    </div>
  );
};

export default CameraScreenRecorder;
