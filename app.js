const express = require('express');
const app = express();
const expressSession = require('express-session');
const connectDb = require('./modules/connection.js');
const routes = require('./routes/routes');
const socket = require('./socket/socketIO');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');
const hour = 3600000;
 //jei nepaleista i produkcija reiskia kodas yra dev stage ir galima naudoti .env faila su enviroment variables
if (process.env.STAGE !== 'prod') {
    const dotenv = require('dotenv');
    dotenv.config({
        path: './.env'
    });
};

connectDb(mongoose);

const server = app.listen(process.env.PORT || 3000);

const session = (expressSession({
    name: 'sessionID',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: hour*6, //sesija galiuoja 6 valandas
        sameSite: true,
        secure: false, //false jei per http (ir dev mode), true veikia tik per https websites 
    }
}));
app.use(session);
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/assets'));
app.use('/img', express.static(__dirname + '/images'));
console.log('this should be after server');
app.use('/', routes);

// socket setup
socket.socketInit(server, session);
