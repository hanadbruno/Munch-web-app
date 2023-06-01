import CanvasDraw from "react-canvas-draw";
import React, { useRef, useState } from "react";
import "../FinishedDrawing.css";

const FinishDrawing = () => {
  const [brushRadius] = useState(6);
  const [brushColor] = useState("#444");
  // canvas reference:
  const canvasRef = useRef(null);


  return (
    <div className="ArtworkBody">
        <div className="ArtworkImage"></div>
      <h3 className="Title">Title</h3>
      <input placeholder="Unnamed"></input>
      <h3 className="Title">Signature</h3>

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

    <button className="save-button">
        SAVE
      </button>
    </div>
    
  );
};

export default FinishDrawing;