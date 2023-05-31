import React, { useState } from "react";
import CanvasDraw from "react-canvas-draw";

const DrawingBoard = () => {
  const [brushRadius, setBrushRadius] = useState(12);
  const [brushColor, setBrushColor] = useState("#444");

  const handleRadiusChange = (event) => {
    setBrushRadius(event.target.value);
  };

  const handleColorChange = (event) => {
    setBrushColor(event.target.value);
  };

  return (
    <>
      <div
        className="canvas-section"
        style={{
          position: "relative",
          backgroundColor: "#fe390f",
        }}
      >
        <div style={{ padding: "30px" }}>
          <CanvasDraw
            loadTimeOffset={5}
            lazyRadius={20}
            brushRadius={brushRadius}
            brushColor={brushColor}
            catenaryColor={"#0a0302"}
            hideGrid={true}
            canvasWidth={800}
            canvasHeight={500}
            disabled={false}
            imgSrc={""}
            saveData={null}
            immediateLoading={false}
            hideInterface={false}
          />
        </div>
      </div>

      <div
        className="settingsContainer"
        style={{
          position: "absolute",
          top: "100px",
          left: "10px",
          backgroundColor: "#fe390f",
        }}
      >
        <label>
          Brush Radius:
          <input
            type="range"
            min="1"
            max="50"
            value={brushRadius}
            onChange={handleRadiusChange}
          />
        </label>
        <label>
          Brush Color:
          <input type="color" value={brushColor} onChange={handleColorChange} />
        </label>

        <button>Upload image</button>
      </div>
    </>
  );
};

export default DrawingBoard;