// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import About from "./About";
import CameraScreenRecorder from "./components/CameraScreenRecorder";
import InitiateHume from "./components/InitiateHume";

function App() {
  return (
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
            <Route
              exact
              path="/"
              element={
                <section id="features">
                  <h2>Features</h2>
                  <ul>
                    <li>Real-time speech analysis</li>
                    <li>Emotion detection</li>
                    <li>Personalized feedback</li>
                    <li>Interactive training modules</li>
                  </ul>
                  <CameraScreenRecorder />
                  <InitiateHume />
                </section>
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer>&copy; 2024 SpeakEazy. All rights reserved.</footer>
      </div>
    </Router>
  );
}

export default App;
