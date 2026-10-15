const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const setUpMessageSocket = require('./sockets/messageSocket.js');


require('dotenv').config();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());


const userRouter = require('./routes/userRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const medecinRouter = require('./routes/medecinRoutes.js');
const messageRouter = require('./routes/messageRoutes.js');
const adminRouter = require('./routes/adminRoutes.js');

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/medecin', medecinRouter);
app.use('/messages', messageRouter);
app.use('/admin', adminRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

setUpMessageSocket(io);
server.listen('3001', () => {
    console.log('Server is running on port 3001');
})

module.exports = app;