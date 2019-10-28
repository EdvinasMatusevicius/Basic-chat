const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nick: String,
    password: String
});
const NewUser = mongoose.model('chatuser', userSchema);
module.exports = NewUser;