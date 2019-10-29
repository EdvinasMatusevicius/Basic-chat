const express = require('express');
const app = express();
const dotenv = require('dotenv');
const expressSession = require('express-session');
const connectDb = require('./modules/connection.js');
const routes = require('./routes/routes');
const socket = require('./socket/socketIO');

dotenv.config({
    path: './.env'
});

connectDb();

const server = app.listen(process.env.PORT || 3000);

const session = (expressSession({
    name: 'sessionID',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    cookie: {
        sameSite: true,
        secure: false, //false jei per http (ir dev mode), true veikia tik per https websites 
    }
}));
app.use(session);
app.set('view engine','ejs');
app.use('/public',express.static(__dirname+'/assets'));
app.use('/img',express.static(__dirname+'/images'));

app.use('/',routes);

// socket setup
socket.socketInit(server,session);
