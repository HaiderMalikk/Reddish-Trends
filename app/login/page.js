'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function LoginPage() {
  const [message, setMessage] = useState("Connecting...");
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize router

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setMessage("Logging in..."); // Set message to "Logging in..." when login is initiated
    if (ws) {
      ws.send(JSON.stringify({ type: "login", username, password }));
    }
  };
  
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5001");
  
    socket.onopen = () => setMessage("Connected to Server!");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "error") {
        setError(data.message); // Display error from the server
        setMessage(""); // Update the message when login fails
      } else if (data.type === "success") {
        setMessage(data.message);
        router.push("/dashboard"); // Redirect to dashboard on success
      } else {
        setMessage(data.message); // Any other message type
      }
    };
  
    socket.onerror = () => {
      setMessage("Servers down. Please try again later.");
    };
  
    setWs(socket);
  
    return () => socket.close();
  }, [router]);
  

  return (
    <div className="flex flex-col min-h-screen bg-customBlue">

      {/* Main Login Form Section */}
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-xl p-12 bg-white rounded-lg shadow-lg min-h-[500px]">
          <header className="mb-8 text-center">
            <h2 className="text-3xl font-signature text-customBlue">Welcome Back</h2>
            <p className="mt-2 text-gray-500">Please sign in to continue</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customBlue text-black"
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
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customBlue text-black"
              />
            </div>

            {/* Button Container */}
            <div className="flex flex-col space-y-4 mt-6 pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-customBlue text-white rounded-lg hover:bg-customDark"
              >
                Login
              </button>

              {/* Sign Up Button */}
              <button
                type="button"
                className="w-full py-3 border border-gray-300 rounded-lg text-customBlue hover:bg-gray-100"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-red-600">
            {error}
          </div>

          {message && (
          <div className="mt-6 text-center text-sm text-gray-600">
            {message}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
