import React, { useRef, useState } from "react";
import "../Drawing.css";
import CanvasDraw from "react-canvas-draw";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { Brush, Opacity } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import BrushIcon from '@mui/icons-material/Brush';

function Drawing() {
  const navigate = useNavigate();
  const [brushRadius, setBrushRadius] = useState(12);
  const [brushColor, setBrushColor] = useState("#444");
  const [showSlider, setShowSlider] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const canvasRef = useRef(null);

  const handleRadiusChange = (event) => {
    setBrushRadius(event.target.value);
  };

  const handleColorChange = (event) => {
    setBrushColor(event.target.value);
  };

  const handleEraseAll = () => {
    if (canvasRef.current) {
      if (window.confirm("Are you sure you want to erase all?")) {
        canvasRef.current.eraseAll();
      }
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleBrushIconClick = () => {
    setShowSlider(!showSlider);
    setShowColorPicker(false);
  };

  const handlePaletteIconClick = () => {
    setShowColorPicker(!showColorPicker);
    setShowSlider(false);
  };

  const handleSliderChange = (event) => {
    setBrushRadius(event.target.value);
  };

  const handleSaveClick = async () => {
    // Get the canvas' internal canvas and convert it to a base64 PNG
    const canvas = canvasRef.current.canvasContainer.children[1];
    const dataUrl = canvas.toDataURL("image/png");

    // Send the base64 PNG to your server...
    const response = await fetch("http://localhost:3001/save-image", {
      // remember to specify the complete URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: dataUrl }),
    });

    if (response.ok) {
      const { filename, filename2 } = await response.json();
      navigate("/FinishedDrawing", { state: { filename, filename2 } });
    } else {
      navigate("/FinishedDrawing");
    }
  };

  return (
    <div className="Drawing">
     <div className="delete-icon" style={{ position: "absolute", top: 5, right: 20 }}>
  <IconButton>
    <DeleteIcon className="erase-button" onClick={handleEraseAll} />
  </IconButton>

<label style={{ position: "fixed", top: 2, right: 80 }}>
  <IconButton color="black" style={{ fontSize: 50 }}>
    <RefreshIcon fontSize="inherit" onClick={handleUndo} />
  </IconButton>
</label>
</div>

      <CanvasDraw
        ref={canvasRef}
        className="canvas-draw"
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

      <label>
        <div className="color-picker">
          <div className="icon-container">
            <PaletteIcon
              fontSize="large"
              onClick={handlePaletteIconClick}
            />
            <BrushIcon
              fontSize="large"
              onClick={handleBrushIconClick}
            />
          </div>
          {showColorPicker && (
            <input
              type="color"
              value={brushColor}
              onChange={handleColorChange}
            />
          )}
        </div>
      </label>

      {showSlider && (
        <div className="slider-container">
          <input
            type="range"
            min="1"
            max="50"
            value={brushRadius}
            onChange={handleSliderChange}
          />
        </div>
      )}

     

      <div className="button-container">
        
   
          <button className="save-button" onClick={handleSaveClick}>
            DONE
          </button>
      </div>
    </div>
  );
}

export default Drawing;





