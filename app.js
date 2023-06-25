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
let allMsg = {}

io.on("connection", (socket) => {
  console.log("connect : ", socket.id);
  socket.on("enter", (data) => {
    let isNameExist = users.findIndex( el => el.name === data.username) !== -1
    if(isNameExist)
      return alert('Please choose another name')
    socket.join(data.room)
    users.push({id: socket.id, name: data.username, room: data.room});
    allMsg[data.room] = allMsg[data.room] ? allMsg[data.room] : []
    console.log(users);
    console.log(allMsg)
    io.to(data.room).emit("getMessage", allMsg[data.room])
    // console.log('----------------')
    // console.log(socket.rooms)
  });

  socket.on("disconnect", () => {
    console.log("Disconnect : ", socket.id);
    let idx = users.findIndex(el => el.id === socket.id)
    users.splice(idx, 1)
    if(users.length === 0)
      allMsg = {}
    console.log(users)
  });

  socket.on("sendMessage", ({username, msg, room}) => {
    // console.log( socket.id,' : ', msg)
    allMsg[room].push({id: socket.id,username, msg })
    console.log(allMsg[room])
    io.to(room).emit("getMessage", allMsg[room])
  })
});

server.listen(8080, () => console.log("Server on 8080..."));
