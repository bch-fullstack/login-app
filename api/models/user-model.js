const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    phone: String
});

userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = User;