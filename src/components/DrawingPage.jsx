import React, { useRef, useState } from "react";
import "../Drawing.css";
import CanvasDraw from "react-canvas-draw";
// maybe remove:
import { useNavigate } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { Opacity } from "@mui/icons-material";
import { Link } from "react-router-dom";

function Drawing() {
  const navigate = useNavigate();
  const [brushRadius, setBrushRadius] = useState(12);
  const [brushColor, setBrushColor] = useState("#444");
  // canvas reference:
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

  // on save click here:
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
      const { filename } = await response.json();
      navigate("/FinishedDrawing", { state: { filename } });
    } else {
      // Handle error...
    }
  };

  return (
    <div className="Drawing">
      <label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushRadius}
          onChange={handleRadiusChange}
        />
      </label>
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
          <div
            className="color-preview"
            style={{ backgroundColor: brushColor }}
          ></div>
          <input type="color" value={brushColor} onChange={handleColorChange} />
        </div>

        <IconButton color="black" style={{ fontSize: 50 }}>
          <RefreshIcon fontSize="inherit" onClick={handleUndo} />
        </IconButton>
      </label>

      {/* save button, need to route to starting page */}
      <div className="button-container">
        ¨
        <button className="erase-button" onClick={handleEraseAll}>
          ERASE ALL
        </button>
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
