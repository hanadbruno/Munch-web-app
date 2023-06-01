import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../App.css";

//TEST COMMENT
function App() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleStartClick = () => {
    navigate('/DrawingPage');
  };

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
        />
      </div>
      <button className="start-button" onClick={handleStartClick}>
        START
      </button>
    </div>
  );
}

export default App;
