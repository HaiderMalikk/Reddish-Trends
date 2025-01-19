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

  ws.send(JSON.stringify({ message: "All Systems Online" }));

  ws.on("message", (data) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.type === "login") {
        const { username, password } = parsedData;

        // Validate credentials
        if (username === "HaiderMalikk" && password === "malik2005") {
          ws.send(
            JSON.stringify({ type: "success", message: "Login successful!" })
          );
        } else {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Username or password is incorrect.",
            })
          );
        }
      } else {
        ws.send(JSON.stringify({ message: "Unknown command received." }));
      }
    } catch (err) {
      console.error("Error parsing message:", err);
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid data format." })
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`WebSocket Server running on ws://localhost:${PORT}`)
);
