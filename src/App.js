import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import About from "./About";
import CameraScreenRecorder from "./components/CameraScreenRecorder";
import ChatBox from "./ChatBox";
import "./ChatBox.css";

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
          <Link to="/chat">Chat</Link> {/* Add a link to the Chat route */}
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
                  {/* Add the CameraScreenRecorder component here */}
                  <CameraScreenRecorder />
                </section>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<ChatBox />} />{" "}
            {/* Add the ChatBox component route */}
          </Routes>
        </main>
        <footer>&copy; 2024 SpeakEazy. All rights reserved.</footer>
      </div>
    </Router>
  );
}

export default App;
