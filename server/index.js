const PORT = process.env.PORT || 4000;

const WebSocket = require("ws");
const { login, cast_vote } = require("./controllers/user");
const { createRoom, joinRoom, getRooms } = require("./controllers/room");
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (socket) => {
  console.log("New connection!!");

  socket.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type == "LOGIN") {
      console.log("data sending to client", data);
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

console.log("Server is running on port", PORT);
