// src/components/CameraScreenRecorder.js
import React, { useState, useRef, useEffect } from "react";

const CameraScreenRecorder = () => {
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const chunks = useRef([]);
  const videoRef = useRef(null);
  const screenVideoRef = useRef(null);

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
    if (screenStream && screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [cameraStream, screenStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setCameraStream(stream);
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setScreenStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };
      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing screen:", error);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "recording.webm";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        // Clear chunks
        chunks.current = [];
      };
      setIsRecording(false);
    }

    // Stop the camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsCameraOn(false);
    }

    // Stop the screen stream
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }

    // Clear video elements
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
    }
  };

  return (
    <div>
      <div>
        <video
          ref={videoRef}
          autoPlay
          style={{
            width: "300px",
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1,
          }}
        />
        <button onClick={isCameraOn ? stopRecording : startCamera}>
          {isCameraOn ? "Stop Camera" : "Start Camera"}
        </button>
      </div>
      <div>
        <video
          ref={screenVideoRef}
          autoPlay
          style={{ width: "100%", height: "auto" }}
        />
        <button onClick={isRecording ? stopRecording : startScreenRecording}>
          {isRecording ? "Stop Recording" : "Start Screen Recording"}
        </button>
      </div>
    </div>
  );
};

export default CameraScreenRecorder;
