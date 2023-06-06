import CanvasDraw from "react-canvas-draw";
import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../FinishedDrawing.css";

const FinishedDrawing = () => {
  const [brushRadius] = useState(6);
  const [brushColor] = useState("#444");
  const [artworkName, setArtworkName] = useState("");
  // canvas reference:
  const canvasRef = useRef(null);

  const location = useLocation();
  const { filename2, filename, projectFileName } = location.state;

  //setting name of art
  const handleArtworkNameChange = (event) => {
    setArtworkName(event.target.value);
  };

  const handleSaveClick = async () => {
    // Get the canvas' internal canvas and convert it to a base64 PNG
    const canvas = canvasRef.current.canvasContainer.children[1];
    const dataUrl = canvas.toDataURL('image/png');

    // Send the base64 PNG and artwork name to your server...
    const response = await fetch('http://localhost:3001/save-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        signature_image: dataUrl, 
        artwork_name: artworkName === "" ? "UNTITLED" : artworkName, 
        filename, 
        filename2 
      })
    });

    if (!response.ok) {
      // Handle error...
    }
  };

  const serverUrl = 'http://localhost:3001/';

  return (
    <div className="ArtworkBody">
        <div className="ArtworkImage">
        <img src="http://localhost:5000/images/artpiece_1686040340888.jpg" alt="Artwork" />
        </div>
      <h3 className="Title">TITLE</h3>
      <input
        placeholder="UNTITLED" 
        value={artworkName}
        onChange={handleArtworkNameChange}
      />
      <h3 className="Title">SIGNATURE</h3> 

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
        canvasWidth={800}
        canvasHeight={200}
        disabled={false}
        imgSrc={""}
        saveData={null}
        immediateLoading={false}
        hideInterface={false}
      />

    <button className="save-button" onClick={handleSaveClick}>
        SAVE
      </button>

      <button className="quit-button">
        QUIT
      </button>
    </div>
  );
};

export default FinishedDrawing;
