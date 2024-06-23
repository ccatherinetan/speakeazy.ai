// src/WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to your backend WebSocket server
    const ws = new WebSocket("ws://localhost:3001/proxy");
    ws.onopen = () => console.log("Connected to backend WebSocket");
    ws.onclose = () => console.log("Disconnected from backend WebSocket");

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Custom hook to use WebSocket
export function useWebSocket() {
  return useContext(WebSocketContext);
}
