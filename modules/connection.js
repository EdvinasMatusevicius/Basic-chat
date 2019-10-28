const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDb = function () {
    dotenv.config({
        path: './.env'
    });
    // mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connect(`mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@basicchat-lha68.mongodb.net/users?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

    mongoose.connection.once('open', function () {
        console.log('connection to mongo database has been made ');
    }).on('error', function (error) {
        console.log('connection ERROR to mongo database ', error);
    });
}
module.exports = connectDb;
// run db localy "C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe"