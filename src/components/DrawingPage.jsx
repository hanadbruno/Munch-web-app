import React, { useRef, useState } from 'react';
import '../Drawing.css';
import CanvasDraw from "react-canvas-draw";
// maybe remove: 
import { useNavigate } from 'react-router-dom';

function Drawing() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [brushRadius, setBrushRadius] = useState(12);
  const [brushColor, setBrushColor] = useState('#444');
  // canvas reference:
  const canvasRef = useRef(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRadiusChange = (event) => {
    setBrushRadius(event.target.value);
  };

  const handleColorChange = (event) => {
    setBrushColor(event.target.value);
  };

  // on save click here:
  const handleSaveClick = async () => {
    // Get the canvas' internal canvas and convert it to a base64 PNG
    const canvas = canvasRef.current.canvasContainer.children[1];
    const dataUrl = canvas.toDataURL('image/png');

    // Send the base64 PNG to your server...
    const response = await fetch('http://localhost:3001/save-image', {
      // remember to specify the complete URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: dataUrl })
    });

    if (response.ok) {
      const { filename } = await response.json();
      navigate('/FinishedDrawing', { state: { filename } });
    } else {
      // Handle error...
    }
  };

  return (
    <div className="Drawing">
      <label>
        <input type="range" min="1" max="50" value={brushRadius} onChange={handleRadiusChange} />
      </label>
      <label>
        <div className="color-picker">
          <div className="color-preview" style={{ backgroundColor: brushColor }}></div>
          <input type="color" value={brushColor} onChange={handleColorChange} />
        </div>
      </label>
      <CanvasDraw
        ref={canvasRef}
        className='canvas-draw'
        loadTimeOffset={5}
        lazyRadius={0}
        brushRadius={brushRadius}
        brushColor={brushColor}
        catenaryColor={"#0a0302"}
        gridColor={"rgba(150,150,150,0.17)"}
        hideGrid={false}
        canvasWidth={1000}
        canvasHeight={1000}
        disabled={false}
        imgSrc={""}
        saveData={null}
        immediateLoading={false}
        hideInterface={false}
      />
      <div className="input-container">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
        />
      </div>
      {/* save button, need to route to starting page */}
      <button className="save-button" onClick={handleSaveClick}>
        SAVE
      </button>
    </div>
  );
}

export default Drawing;
