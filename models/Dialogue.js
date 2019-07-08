const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DialogueSchema = new Schema({
    members: [
        mongoose.Schema.Types.ObjectId,
        mongoose.Schema.Types.ObjectId
    ]
})

const Dialogue = mongoose.model('Dialogue', DialogueSchema);

module.exports = Dialogue