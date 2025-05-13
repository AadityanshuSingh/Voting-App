const express = require("express");
const app = express();

const { createServer } = require("http");
const httpServer = createServer(app);

const WebSocket = require("ws");
const { login, cast_vote } = require("./controllers/user");
const { createRoom, joinRoom, getRooms } = require("./controllers/room");
const wss = new WebSocket.Server({ server: httpServer });

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

wss.on("connection", (socket) => {
  console.log("New connection!!");

  socket.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type == "LOGIN") {
      const res = login(data.payload);
      socket.send(JSON.stringify(res));
    } else if (data.type == "CREATE_ROOM") {
      createRoom(data);
    } else if (data.type == "JOIN_ROOM") {
      const res = joinRoom(data);
      socket.send(JSON.stringify(res));
    } else if (data.type == "CAST_VOTE") {
      console.log("data reveived for voting in server", data);
      const res = cast_vote(data);
      if (!res.success) {
        socket.send(JSON.stringify(res));
      } else {
        wss.clients.forEach((client) => {
          if (client.readyState == WebSocket.OPEN) {
            client.send(JSON.stringify(res));
          }
        });
      }
    } else if (data.type == "GET_ROOM") {
      const res = getRooms();
      // socket.send(JSON.stringify(res));
      wss.clients.forEach((client) => {
        if (client.readyState == WebSocket.OPEN) {
          client.send(JSON.stringify(res));
        }
      });
    }
  });

  socket.on("close", () => {
    console.log("Client Disconnected");
  });
});

httpServer.listen(4000, () => {
  console.log(`App is running successfully at 4000`);
});
