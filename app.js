const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("This is chat Server..");
});
let users = [];

io.on("connection", (socket) => {
  console.log("connect : ", socket.id);
  socket.on("enter", (username) => {
    let isNameExist = users.findIndex( el => el.name === username) !== -1
    if(!isNameExist)
      users.push({id: socket.id, name: username});
    console.log(users);
  });
  socket.on("disconnect", () => {
    console.log("Disconnect : ", socket.id);
    let idx = users.findIndex(el => el.id === socket.id)
    users.splice(idx, 1)
    console.log(users)
  });
});

server.listen(8080, () => console.log("Server on 8080..."));
