const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    dialogueId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now()
    }
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message