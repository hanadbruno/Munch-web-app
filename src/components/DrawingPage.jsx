
import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineUndo, MdOutlineRedo } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { BsFillPaletteFill, BsFillBrushFill } from 'react-icons/bs';
import { HexColorPicker } from 'react-colorful';
import { useNavigate } from "react-router-dom";
import "../Drawing.css";

function Drawing() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const brushSizeInputRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(1);
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(-1);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [showBrushSizeInput, setShowBrushSizeInput] = useState(false);
  const [displayDoneOptions, setDisplayDoneOptions] = useState(false);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
  }, [brushColor, brushSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1536;
    canvas.height = 2048;

    const context = canvas.getContext('2d');
    context.scale(1536 / canvas.clientWidth, 2048 / canvas.clientHeight);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
        if (
            (brushSizeInputRef.current && !brushSizeInputRef.current.contains(e.target)) &&
            (colorPickerRef.current && !colorPickerRef.current.contains(e.target))
        ) {
            setShowBrushSizeInput(false);
            setDisplayColorPicker(false);
        }
    };

    const handleTouchOutside = e => {
        if (
            (brushSizeInputRef.current && !brushSizeInputRef.current.contains(e.target)) &&
            (colorPickerRef.current && !colorPickerRef.current.contains(e.target))
        ) {
            setShowBrushSizeInput(false);
            setDisplayColorPicker(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchOutside);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, []); 

  const startDrawing = ({ nativeEvent }) => {
    if (displayDoneOptions) {
        return;
    }

    const { offsetX, offsetY, touches } = nativeEvent;
    if (touches) {
      const { pageX, pageY } = touches[0];
      const { top, left } = canvasRef.current.getBoundingClientRect();
      contextRef.current.beginPath();
      contextRef.current.moveTo(pageX - left, pageY - top);
    } else {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
    }
    contextRef.current.lineWidth = brushSize;
    setDrawing(true);
  };
  
  const finishDrawing = () => {
    contextRef.current.closePath();
    setDrawing(false);
    setHistory([...history, contextRef.current.getImageData(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height)]);
    setStep(prevStep => prevStep + 1);
  };
  
  const draw = ({ nativeEvent }) => {
    if (!drawing) {
      return;
    }

    const { offsetX, offsetY, touches } = nativeEvent;
    if (touches) {
      const { pageX, pageY } = touches[0];
      const { top, left } = canvasRef.current.getBoundingClientRect();
      contextRef.current.lineTo(pageX - left, pageY - top);

    } else {
      contextRef.current.lineTo(offsetX, offsetY);
    }
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const context = contextRef.current;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    let blankState = context.getImageData(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
    setHistory([...history, blankState]);
    setStep(prevStep => prevStep + 1);
};

const undo = () => {
    if (step > 0) {
        setStep(prevStep => prevStep - 1);
        contextRef.current.putImageData(history[step - 1], 0, 0);
    }
};

const redo = () => {
    if (step < history.length - 1) {
        setStep(prevStep => prevStep + 1);
        contextRef.current.putImageData(history[step + 1], 0, 0);
    }
};

const quit = () => {
  navigate("/");
}


const handleSaveClick = async () => {

  // Get the canvas' internal canvas and convert it to a base64 PNG
  const canvas = canvasRef.current;
  const dataUrl = canvas.toDataURL("image/png");

  // Send the base64 PNG to your server...
  const response = await fetch("http://192.168.172.133:3001/save-image", {
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

    // Clear the history state after a successful save
    setHistory([]);
    setStep(-1);
  } else {
    navigate("/FinishedDrawing");
  }
};

  const containerStyle = {
    position: 'fixed',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    margin: '0',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fe390f',
  };

  const canvasContainerStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  const redoButtonStyle = {
    position: 'absolute',
    color: 'black',
    margin: '0',
    padding: '0',
    right: '0',
    top: '-4.5vh',
    background: 'none',
    border: 'none',
    textDecoration: 'none',
    fontSize: '5vw',
    cursor: 'pointer',
  };

  const undoButtonStyle = {
    position: 'absolute',
    color: 'black',
    margin: '0',
    padding: '0',
    right: '9vw',
    top: '-4.5vh',
    background: 'none',
    border: 'none',
    textDecoration: 'none',
    fontSize: '5vw',
    cursor: 'pointer',
  };

  const clearButtonStyle = {
    position: 'absolute',
    color: 'black',
    margin: '0',
    padding: '0',
    right: '5vw',
    top: '-4.7vh',
    background: 'none',
    border: 'none',
    textDecoration: 'none',
    fontSize: '4vw',
    cursor: 'pointer',
  };

  const canvasStyle = {
    display: 'block',
    width: '87vw',
    margin: '0',
    padding: '0',
    background: 'white'
  };

  const doneButtonStyle = {
    position: 'absolute',
    color: 'black',
    fontFamily: 'GirottMunch',
    fontSize: '5vw',
    textTransform: 'uppercase',
    margin: '0',
    padding: '0',
    right: '0',
    bottom: '-6.4%',
    background: 'none',
    border: 'none',
    textDecoration: 'none',
    cursor: 'pointer',
  };

    const colorPickerContainerStyle = {
        position: 'absolute',
        color: 'black',
        margin: '0',
        padding: '0',
        bottom: '-6.1%',
        fontSize: '5.5vw',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const colorPickerStyle = {
        position: 'absolute',
        backgroundColor: 'black',
        border: '15px solid black',
        borderRadius: '10px',
        zIndex: '2',
        bottom: '40vh',
        left: '33vw',
        transform: 'scale(2)',
        transformOrigin: 'center',
    };

    const brushSizeInputStyle = {
        position: 'absolute',
        color: 'black',
        margin: '0',
        padding: '0',
        bottom: '-6.1%',
        left: '8vw',
        fontSize: '5.5vw',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const doneButtonsContainerStyle = {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '56vw',
        bottom: '-6.4%',
        left: '15%',
        margin: '0',
        padding: '0',
    };

    const doneButtonsStyle = {
        color: 'black',
        fontFamily: 'GirottMunch',
        fontSize: '5vw',
        textTransform: 'uppercase',
        marginRight: 'vw',
        marginLeft: '7vw',
        background: 'none',
        border: 'none',
        textDecoration: 'none',
        cursor: 'pointer',
    }


  return (
    <div style={containerStyle}>
        <div style={canvasContainerStyle}>
            {!displayDoneOptions && <button onClick={undo} style={undoButtonStyle}><MdOutlineUndo /></button>}
            {!displayDoneOptions && <button onClick={clearCanvas} style={clearButtonStyle}><FaTrashAlt /></button>}
            {!displayDoneOptions && <button onClick={redo} style={redoButtonStyle}><MdOutlineRedo /></button>}
            <canvas
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={finishDrawing}
                onTouchMove={draw}
                ref={canvasRef}
                style={canvasStyle}
            />
            <div ref={colorPickerRef} style={colorPickerContainerStyle}>
                {!displayDoneOptions && !displayColorPicker && <BsFillPaletteFill onClick={() => {setShowBrushSizeInput(false); setDisplayColorPicker(true)}} />}
                {displayColorPicker && (
                    <div style={colorPickerStyle}>
                        <HexColorPicker color={brushColor} onChange={setBrushColor} />
                    </div>
                )}
            </div>
            <div ref={brushSizeInputRef} style={brushSizeInputStyle}>
                {!displayDoneOptions && !showBrushSizeInput && <BsFillBrushFill onClick={e => {setDisplayColorPicker(false); setShowBrushSizeInput(prev => !prev);}} />}
                {showBrushSizeInput && <input type="range"
                                              min={1}
                                              max={50}
                                              value={brushSize}
                                              onChange={e => setBrushSize(Number(e.target.value))}
                                              className="slider"
                                        />
                }
            </div>
            {!displayDoneOptions && <button onClick={() => setDisplayDoneOptions(true)} style={doneButtonStyle}>DONE</button>}
            {displayDoneOptions &&
                <div style={doneButtonsContainerStyle}>
                    <button onClick={handleSaveClick} style={doneButtonsStyle}>SAVE</button>
                    <button onClick={quit} style={doneButtonsStyle}>QUIT</button>
                    <button onClick={() => setDisplayDoneOptions(false)} style={doneButtonsStyle}>BACK</button>
                </div>
            }
        </div>

    </div>
  );
}

export default Drawing;

