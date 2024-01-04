import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Dropdown from "react-bootstrap/Dropdown";

// Dropdown menu 
const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <a
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <span className="threedots" />
  </a>
));

const API_BASE = "http://localhost:3001";

function App() {
  const [notes, setNotes] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    GetNotes();
    console.log(notes);
  }, [])

  // Fetchs notes from database
  const GetNotes = () => {
    fetch(API_BASE + "/notes")
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("ERROR: ", err));
  }

  // Marks note as completed
  const markCompleted = async id => {
    const data = await fetch(API_BASE + "/notes/complete/" + id)
      .then(res => res.json())

    setNotes(notes => notes.map(notes => {
      if (notes._id === data._id) {
        notes.complete = data.complete;
      }

      return notes;
    }));
  }

  const addNote = async () => {
    const data = await fetch(API_BASE + "/notes/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newNotes
      })
    }).then(res => res.json());

    setNotes([...notes, data]);
    setPopupActive(false);
    setNewNotes("");
  }

  // Deletes selected note
  const deleteNote = async id => {
    const data = await fetch(API_BASE + "/notes/delete/" + id, {
      method: "DELETE"
    }).then(res => res.json())

    setNotes(notes => notes.filter(notes => notes._id !== data._id))
  }

  return (
    <div className="App">
      <h1 className="m-3">My Notes</h1>

      {/* Add notes button */}
      <Button variant="light m-3" onClick={() => setPopupActive(true)}>Add Note </Button>

      {/* Add new note pop up */}
      {popupActive ? (
        <div className='popup m-3 border rounded p-3 col-4'>
          <div className='content'>
            <div className='closePopup float-end' onClick={() => setPopupActive(false)}>X</div>
            <h3>New Note</h3>
            <input
              type='text'
              className='add-note-input'
              onChange={e => setNewNotes(e.target.value)}
              value={newNotes} />
            <input className="btn btn-light p-1 mt-1" type="submit" onClick={addNote} value="Create" />
          </div>
        </div>
      ) : ''}


      {/* Current notes displayed here */}
      <div className="notes row">
        {notes.map(notes => (

          <div className={
            "notes-div p-3 border border-2 rounded col-5 m-4 "
            + (notes.complete ? "is-complete" : "")
          } key={notes._id}>

            <div className="note-body ps-5">{notes.text}</div>

            {/* Dropdown for notes CRUD functionality  */}
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu className='dropdown-menu'>
                <Dropdown.Item>Edit</Dropdown.Item>
                <Dropdown.Item onClick={() => markCompleted(notes._id)}>Mark as {(notes.complete ? "in" : "")}complete</Dropdown.Item>
                <Dropdown.Item onClick={() => deleteNote(notes._id)}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
