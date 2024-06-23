// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import About from "./About";
import CameraScreenRecorder from "./components/CameraScreenRecorder";
import { WebSocketProvider } from "./components/WebSocketContext"; // Import the WebSocket context provider

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Welcome to SpeakEazy</h1>
            <p>Your AI-powered public speaking assistant</p>
          </header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
          <main>
            <Routes>
              <Route path="/" element={<CameraScreenRecorder />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <footer>&copy; 2024 SpeakEazy. All rights reserved.</footer>
        </div>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
