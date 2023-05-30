import React, { useState } from 'react';
import './App.css';
import CanvasDraw from "react-canvas-draw";

function App() {
  const [brushRadius, setBrushRadius] = useState(12);
  const [brushColor, setBrushColor] = useState('#444');

  const handleRadiusChange = (event) => {
    setBrushRadius(event.target.value);
  };

  const handleColorChange = (event) => {
    setBrushColor(event.target.value);
  };

  return (
    <div className="App">
      <label>
        Brush Radius:
        <input type="range" min="1" max="50" value={brushRadius} onChange={handleRadiusChange} />
      </label>
      <label>
        Brush Color:
        <input type="color" value={brushColor} onChange={handleColorChange} />
      </label>
      <CanvasDraw
        loadTimeOffset={5}
        lazyRadius={20}
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
    </div>
  );
}

export default App;
