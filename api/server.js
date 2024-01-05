const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Connects database and returns success message or error
mongoose.connect("mongodb://127.0.0.1:27017/mern-notes").then(() => console.log("Connected to Database")).catch(console.error);

const Notes = require('./models/Notes');

// Gets all current Notes
app.get('/notes', async (req, res) => {
    const notes = await Notes.find();

    res.json(notes);
})

// Creates new note
app.post('/notes/new', (req, res) => {
    const notes = new Notes({
        text: req.body.text
    });

    notes.save();
    res.json(notes);
});

// Deletes a note
app.delete('/notes/delete/:id', async (req, res) => {
    const result = await Notes.findByIdAndDelete(req.params.id);

    res.json(result);
});

// Updates notes completed field 
app.get('/notes/complete/:id', async (req, res) => {
    const notes = await Notes.findById(req.params.id);
    notes.complete = !notes.complete;
    notes.save();
    res.json(notes);
})

// Edit existing note
app.put('/notes/edit/:id', async (req, res) => {
    const notes = await Notes.findById(req.params.id);
    notes.text = req.body.text
    notes.save();
    res.json(notes);
})

// Starts server on local port 3001 and logs success message
app.listen(3001, () => console.log("Server started on port 3001"));