// src/components/CameraScreenRecorder.js
import React, { useRef, useState, useEffect } from "react";

const CameraScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const screenVideoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
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
  };

  return (
    <div>
      <div>
        <video ref={videoRef} autoPlay style={{ width: 300, height: 300 }} />
        <button onClick={isCameraOn ? stopCamera : startCamera}>
          {isCameraOn ? "Stop Camera" : "Start Camera"}
        </button>
      </div>
    </div>
  );
};

export default CameraScreenRecorder;
