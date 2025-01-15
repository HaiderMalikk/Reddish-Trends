'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Connecting...");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5001");

    socket.onopen = () => setMessage("Connected to WebSocket Server!");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage(data.message);
    };

    setWs(socket);

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws) ws.send("Hello from Next.js!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <h2 className="first">Welcome</h2>
      <h1 className="text-4xl font-bold text-blue-600">WebSocket with Next.js</h1>
      <p>{message}</p>
      <button className="btn-primary" onClick={sendMessage}>Send Message</button>
    </div>
  );
}
