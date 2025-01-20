/*  test websocket in express js */

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("New client connected");
  ws.send(JSON.stringify({ message: "Welcome to WebSocket Server!" }));
  ws.on("message", (data) => {
    console.log("Received:", data);
    ws.send(JSON.stringify({ message: "Message received: " + data }));
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`WebSocket Server running on ws://localhost:${PORT}`));