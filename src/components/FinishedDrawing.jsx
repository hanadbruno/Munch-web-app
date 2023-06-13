import CanvasDraw from "react-canvas-draw";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "../FinishedDrawing.css";
import { bannedwords } from "../bannedwords.js";

import { FaTrashAlt } from 'react-icons/fa';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const FinishedDrawing = () => {
  const [brushRadius] = useState(3);
  const [brushColor] = useState('#444');
  const [artworkName, setArtworkName] = useState('');
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {filename, filename2} = location.state // || {};
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [layout, setLayout] = useState("default");

  useEffect(() => {
    function handleClickOutside(event) {
        if (keyboardVisible && !event.target.closest('.keyboard-container')) {
            setKeyboardVisible(false);
        }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [keyboardVisible]);
  
  const handleArtworkNameChange = (event) => {
    document.getElementById("artwork-name").scrollIntoView();
    setArtworkName(event.target.value);
    window.scrollTo(0, 0);
  };

  const handleEraseAllClick = () => {
    canvasRef.current.clear();
  };
  

  const handleQuit = async () => {
    const response = await fetch('http://172.20.10.5:3001/delete-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path: filename2 })
    });
  
    if (!response.ok) {
    } else {
      navigate('/ExitPage');
    }
  };

  const handleSaveClick = async () => {
    const containsBadWords = bannedwords.some(word => artworkName.toLowerCase().includes(word.toLowerCase()));

    if (containsBadWords) {
        alert('Please choose an appropriate name for your artwork!');
        return;
    }

    const canvas = canvasRef.current.canvasContainer.children[1];
    const dataUrl = canvas.toDataURL('image/png');

    const response = await fetch('http://172.20.10.5:3001/save-signature', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            signature_image: dataUrl,
            artwork_name: artworkName === '' ? 'UNTITLED' : artworkName,
            filename
        })
    });

    if (!response.ok) {
        navigate('/ExitPage');
    } else {
        navigate('/ExitPage');
    }
};

  return (
    <div className='artwork-body'>
        <div className='artwork-image'>
          <img src={filename} alt={filename} style={{width: '100%', height: '100%'}}/>
        </div>
      <h3 className="Title">TITLE</h3>
      <input 
        id="artwork-name"
        placeholder="UNTITLED"
        value={artworkName}
        onChange={handleArtworkNameChange}
        onBlur={handleInputBlur}
      />
      <h3 className="Title">SIGNATURE</h3> 

      <button className="erase-all-button" onClick={handleEraseAllClick}><FaTrashAlt/></button>

      <CanvasDraw
        ref={canvasRef}
        className="canvas-draw"
        loadTimeOffset={5}
        lazyRadius={0}
        brushRadius={brushRadius}
        brushColor={brushColor}
        catenaryColor={"#0a0302"}
        gridColor={"rgba(150,150,150,0.17)"}
        hideGrid={true}
        canvasWidth={800}
        canvasHeight={200}
        disabled={false}
        imgSrc={""}
        saveData={null}
        immediateLoading={false}
        hideInterface={false}
      />

<div style={{ display: 'flex' }}>
  <button className="save-button" onClick={handleSaveClick}>
    SAVE
  </button>
  <button className="quit-button" onClick={handleQuit}>
    QUIT
  </button>
</div>
    </div>
  );
};

export default FinishedDrawing;
