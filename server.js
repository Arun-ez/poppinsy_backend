const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const app = express();
const server = require('http').createServer(app);
const PORT = 8080;

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors());

app.get('/', (req, res) => {
    console.log("Server is running ...")
})

io.on('connection', (socket) => {
    socket.emit('user', socket.id);

    socket.on('calluser', ({ userTocall, signalData, from, name }) => {
        io.to(userTocall).emit("calluser", { signal: signalData, from, name });
    })

    socket.on('answercall', (data) => {
        io.emit(data.to).emit("Call Accepted", data.signal);
    })
})


server.listen(PORT, () => {
    console.log("Server is listening ...");
})