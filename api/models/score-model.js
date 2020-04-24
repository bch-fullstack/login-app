const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;
const scoreSchema = new Schema({
    username: String,
    score: Number
});

scoreSchema.plugin(findOrCreate);

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;