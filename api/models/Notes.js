const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Notes Model
const NotesSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
})

const Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;