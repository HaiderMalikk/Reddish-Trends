'use client'

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("Connecting...");
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (ws) {
      ws.send(JSON.stringify({ type: "login", username, password }));
      setMessage("Logging in...");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Main Login Form Section */}
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <header className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-blue-600">Welcome Back</h2>
            <p className="mt-2 text-gray-500">Please sign in to continue</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            {message}
          </div>
        </div>
      </div>

    </div>
  );
}
