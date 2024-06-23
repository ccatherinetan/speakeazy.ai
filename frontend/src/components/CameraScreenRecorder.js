import React, { useRef, useState, useEffect } from "react";
import { useWebSocket } from "./WebSocketContext";

const CameraScreenRecorder = () => {
  const { ws, isConnected } = useWebSocket();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // We don't need audio for image frames
      });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    const tracks = videoRef.current?.srcObject?.getTracks();
    tracks?.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setIsCameraOn(false);
  };

  useEffect(() => {
    let intervalId;
    if (isCameraOn && isConnected && ws) {
      intervalId = setInterval(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d");
          context.drawImage(video, 0, 0);
          canvas.toBlob((blob) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(blob); // Ensure this blob is correctly handled on the server
            }
          }, "image/png");
        }
      }, 1000); // Adjust this interval as needed for your application
    }
    return () => clearInterval(intervalId);
  }, [isCameraOn, isConnected, ws]);

  useEffect(() => {
    if (isConnected && ws) {
      ws.onmessage = (event) => {
        if (typeof event.data === "string") {
          // Handle JSON data
          try {
            const result = JSON.parse(event.data);
            setPrediction(result);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        } else if (event.data instanceof Blob) {
          // Handle Blob data
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const result = JSON.parse(reader.result);
              setPrediction(result);
            } catch (error) {
              console.error("Error parsing Blob to JSON:", error);
            }
          };
          reader.onerror = (error) => {
            console.error("Error reading Blob:", error);
          };
          reader.readAsText(event.data);
        }
      };
    }
  }, [isConnected, ws]);

  if (!isConnected) {
    return <div>Connecting to WebSocket...</div>;
  }

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: 300, height: 300 }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button onClick={isCameraOn ? stopCamera : startCamera}>
        {isCameraOn ? "Stop Camera" : "Start Camera"}
      </button>
      {prediction && (
        <div>
          <h3>Prediction:</h3>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CameraScreenRecorder;
