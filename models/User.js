const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registration_date: {
        type: Date,
        default: Date.now()
    },
    isOnline: {
        type: Boolean,
        default: true
    },
    dialogues: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    last_seen: Date
})

const User = mongoose.model('User', UserSchema);

module.exports = User
