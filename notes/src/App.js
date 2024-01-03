import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
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

  const GetNotes = () => {
    fetch(API_BASE + "/notes")
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("ERROR: ", err));
  }

  return (
    <div className="App">
      <h1 className="m-3">My Notes</h1>
      <div className="notes row">
        {notes.map(notes => (

          <div className={
            "notes-div p-3 border border-2 rounded col-5 m-4 "
            + (notes.complete ? "is-complete" : "")
          } key={notes._id}>

            <div className="note-body ps-5">{notes.text}</div>

            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu className='dropdown-menu'>
                <Dropdown.Item>Edit</Dropdown.Item>
                <Dropdown.Item>Mark as complete</Dropdown.Item>
                <Dropdown.Item>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
