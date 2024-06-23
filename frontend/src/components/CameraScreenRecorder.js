import React, { useRef, useState, useEffect } from "react";
import { useWebSocket } from "./WebSocketContext";

const CameraScreenRecorder = () => {
  const ws = useWebSocket();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);

      // Prepare to record and send data as chunks
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && ws && ws.readyState === WebSocket.OPEN) {
          ws.send(event.data);
        }
      };

      mediaRecorder.start(1000); // Collect 1 second of data
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    mediaRecorderRef.current?.stop();
    const tracks = videoRef.current?.srcObject?.getTracks();
    tracks?.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setIsCameraOn(false);
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
