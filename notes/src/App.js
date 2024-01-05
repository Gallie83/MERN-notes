import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Dropdown from "react-bootstrap/Dropdown";

// Dropdown menu 
const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <a
    href='/'
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <span className="arrow" />
  </a>
));

const API_BASE = "http://localhost:3001";

function App() {
  const [notes, setNotes] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newNotes, setNewNotes] = useState("");

  const [editPopup, setEditPopup] = useState(false);
  const [editId, setEditId] = useState("");
  const [editedNote, setEditedNote] = useState("");


  useEffect(() => {
    GetNotes();
  }, [notes])

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

    // Iterates through notes until id matches
    setNotes(notes => notes.map(notes => {
      if (notes._id === data._id) {
        notes.complete = data.complete;
      }

      return notes;
    }));
  }

  // Creates a new note
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

  // Edit note modal appears and current note Id and old text stored in state
  const editModal = (id, text) => {
    setEditPopup(true);
    setEditId(id);
    setEditedNote(text);
  }

  // Update note- was receiving and error message about unique ID
  // when updating current note, so now the original is deleted and
  // a new note is created when user edits 
  const editNote = async () => {
    deleteNote(editId);
    const data = await fetch(API_BASE + "/notes/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: editedNote
      })
    }).then(res => res.json());

    setNotes([...notes, data]);
    setEditPopup(false);
    setEditedNote("");
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
      <h1 className="m-3 ms-5">My Notes</h1>

      {/* Add notes button */}
      <Button variant="light m-3 ms-5" onClick={() => setPopupActive(true)}>Add Note </Button>

      {/* Add new note pop up */}
      {popupActive ? (
        <div className='popup m-3 ms-5 border rounded p-3 col-3'>
          <div className='content'>
            <div className='closePopup float-end' onClick={() => setPopupActive(false)}>X</div>
            <h3>New Note</h3>
            {/* Note text */}
            <input
              type='text'
              className='w-100'
              onChange={e => setNewNotes(e.target.value)}
              value={newNotes} />
            <br />
            {/* Submit new note */}
            <input
              className="btn btn-light p-1 mt-2"
              type="submit"
              onClick={addNote}
              value="Create"
              disabled={!newNotes} />
          </div>
        </div>
      ) : ''}


      {/* Current notes displayed here */}
      <div className="notes row mx-auto">
        {notes.map(notes => (

          <div className={
            "notes-div p-3 border border-2 rounded col-5 my-4 mx-5 "
            + (notes.complete ? "is-complete" : "")
          } key={notes._id}>

            {/* Dropdown for notes CRUD functionality  */}
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu className='dropdown-menu'>
                <Dropdown.Item onClick={() => editModal(notes._id, notes.text)}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={() => markCompleted(notes._id)}>Mark as {(notes.complete ? "in" : "")}complete</Dropdown.Item>
                <Dropdown.Item onClick={() => deleteNote(notes._id)}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Note content */}
            <div className="note-body ps-5">{notes.text}</div>

          </div>
        ))}

        {/* Edit note Modal */}
        {editPopup ? (

          <Modal show={editPopup} >
            <div className=' bg-dark text-light border rounded p-3'>
              <div className='content'>
                <div className='closePopup float-end' onClick={() => setEditPopup(false)}>X</div>
                <h3>Edit Note</h3>
                {/* Note text */}
                <input
                  type='text'
                  className='w-100'
                  onChange={e => setEditedNote(e.target.value)}
                  value={editedNote} />
                <br />
                {/* Submit updated note */}
                <input
                  className="btn btn-light p-1 mt-2"
                  type="submit"
                  onClick={editNote}
                  value="Update"
                  disabled={!editedNote} />
              </div>
            </div>
          </Modal>
        ) : ''}

      </div>
    </div>
  );
}

export default App;
