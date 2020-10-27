const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    password: String
}, { timestamps: true });

module.exports = mongoose.model('users', UserSchema);