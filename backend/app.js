const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


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

module.exports = app;