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
  };

  const handleSliderChange = (event) => {
    setBrushRadius(event.target.value);
  };

  const handleSaveClick = async () => {
    // Save functionality
  };

  return (
    <div className="Drawing">
      <div className="delete-icon">
        <IconButton>
          <DeleteIcon className="erase-button" onClick={handleEraseAll} />
        </IconButton>
      </div>
      <label>
        {showSlider && (
          <input
            type="range"
            min="1"
            max="50"
            value={brushRadius}
            onChange={handleSliderChange}
          />
        )}
       
      </label>

      <CanvasDraw
      ref={canvasRef}className="canvas-draw"
      loadTimeOffset={5}
      lazyRadius={0}
      brushRadius={brushRadius}
      brushColor={brushColor}
      catenaryColor={"#0a0302"}
      gridColor={"rgba(150,150,150,0.17)"}
      hideGrid={false}canvasWidth={1000}
      canvasHeight={1000}disabled={false}imgSrc={""}saveData={null}immediateLoading={false}hideInterface={false}/>

      <label>
        <div className="color-picker" >
          {/* Replace color-preview with brush icon */}
          <div className="brush-icon">
            <PaletteIcon fontSize="large" />
          </div>
          <input type="color" value={brushColor} onChange={handleColorChange} />
        </div>
     
        <IconButton color="black" style={{ fontSize: 50 }}>
          <RefreshIcon fontSize="inherit" onClick={handleUndo} />
        </IconButton>
      </label>
      <div className="brush-icon">
        <IconButton onClick={handleBrushIconClick}>
          <BrushIcon fontSize="large" />
        </IconButton>
        </div>

      <div className="button-container">
        <Link to="/ExitPage">
          <button className="save-button" onClick={handleSaveClick}>
            DONE
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Drawing;

