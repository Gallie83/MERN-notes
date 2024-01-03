import React from 'react';
import './App.css';
import Dropdown from "react-bootstrap/Dropdown";


const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <btn
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <span className="threedots" />
  </btn>
));

function App() {
  return (
    <div className="App">
      <h1 className="m-3">My Notes</h1>
      <div className="notes-div row">

        <div className="notes p-3 border border-2 rounded col-5 m-4">

          <div className="note-body ps-5">Walk the dog</div>

          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} />
            <Dropdown.Menu className='dropdown-menu'>
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item>Mark as complete</Dropdown.Item>
              <Dropdown.Item>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>


        <div className="notes is-complete p-3 border border-2 rounded col-5 m-4">

          <div className="note-body ps-5">Take out trash</div>

          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} />
            <Dropdown.Menu className='dropdown-menu'>
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item>Mark as complete</Dropdown.Item>
              <Dropdown.Item>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </div>
      </div>
    </div>
  );
}

export default App;
