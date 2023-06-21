const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server,{
  cors: {
    origin: '*'
  }
})


app.use(cors())
app.get('/', (req, res) => {
  res.send('This is chat Server..')
})

io.on('connection', socket => {
  console.log('have a connected event')
  socket.on('disconnect', socket => {
    console.log('have a Disconnected event')
  })
})

server.listen(8080, ()=> console.log('Server on 8080...'))
