import CanvasDraw from 'react-canvas-draw';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import '../css/FinishedDrawing.css';
import { bannedwords } from '../bannedwords.js';
import { FaTrashAlt } from 'react-icons/fa';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import { RiErrorWarningLine } from 'react-icons/ri';

const IP = process.env.REACT_APP_IP_ADD;

const iconSvg = ReactDOMServer.renderToStaticMarkup(
  <RiErrorWarningLine color='#FE390F' />
);
const iconDataUrl = `data:image/svg+xml,${encodeURIComponent(iconSvg)}`;

const FinishedDrawing = () => {
  const [brushRadius] = useState(3);
  const [brushColor] = useState('#444');
  const [artworkName, setArtworkName] = useState('');
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { filename, filename2 } = location.state; // || {};
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [layout, setLayout] = useState('default');

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

  function onChange(input) {
    setArtworkName(input);
    console.log('Input changed', input);
  }

  function onKeyPress(button) {
    console.log('Button pressed', button);
    if (button === '{enter}') {
      setKeyboardVisible(false);
    }
    if (button === '{symbols}') {
      setLayout('symbols');
    }
    if (button === '{abc}') {
      setLayout('default');
    }
  }

  const handleInputFocus = () => {
    setKeyboardVisible(true);
  };

  const handleEraseAllClick = () => {
    canvasRef.current.clear();
  };

  const handleQuit = async () => {
    const ip = process.env.REACT_APP_IP_ADD;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Your artwork will be deleted',

      imageUrl: iconDataUrl,
      imageWidth: 120,
      imageHeight: 120,
      imageAlt: 'Custom image',

      backdrop: 'rgba(1,1,1,0.5)',
      color: 'black',
      showCancelButton: true,
      confirmButtonText: 'Yes, quit!',
      confirmButtonColor: '#FE390F',
      cancelButtonText: 'No, stay here',
      cancelButtonColor: 'black',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`http://${ip}:3001/delete-file`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: filename2 }),
        });

        if (response.ok) {
          navigate('/ExitPage');
        } else {
          // Handle the error here
          // You might want to show another alert to let the user know the operation failed
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      }
    });
  };

  const handleSaveClick = async () => {
    const containsBadWords = bannedwords.some((word) =>
      artworkName.toLowerCase().includes(word.toLowerCase())
    );

    if (containsBadWords) {
      Swal.fire({
        title: 'Oops...',
        text: 'Please choose an appropriate name for your artwork!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FE390F',
        imageUrl: iconDataUrl,
        imageWidth: 120,
        imageHeight: 120,
        imageAlt: 'Custom image',

        backdrop: 'rgba(1,1,1,0.5)',
        color: 'black',
      });
      return;
    }

    const canvas = canvasRef.current.canvasContainer.children[1];
    const dataUrl = canvas.toDataURL('image/png');

    const response = await fetch(`http://${IP}:3001/save-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signature_image: dataUrl,
        artwork_name: artworkName === '' ? 'UNTITLED' : artworkName,
        filename,
      }),
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
        <img
          src={filename}
          alt={filename}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <h3 className='title'>TITLE</h3>
      <div className='input-field' onClick={handleInputFocus}>
        {artworkName || 'UNTITLED'}
      </div>
      {!keyboardVisible && <h3 className='title'>SIGNATURE</h3>}
      {!keyboardVisible && (
        <button className='erase-all-button' onClick={handleEraseAllClick}>
          <FaTrashAlt />
        </button>
      )}
      {!keyboardVisible && (
        <CanvasDraw
          ref={canvasRef}
          className='canvas-draw'
          loadTimeOffset={5}
          lazyRadius={0}
          brushRadius={brushRadius}
          brushColor={brushColor}
          catenaryColor={'#0a0302'}
          gridColor={'rgba(150,150,150,0.17)'}
          hideGrid={true}
          canvasWidth={800}
          canvasHeight={200}
          disabled={false}
          imgSrc={''}
          saveData={null}
          immediateLoading={false}
          hideInterface={false}
        />
      )}
      {!keyboardVisible && (
        <div style={{ display: 'flex' }}>
          <button className='save-button' onClick={handleSaveClick}>
            SAVE
          </button>
          <button className='quit-button' onClick={handleQuit}>
            QUIT
          </button>
        </div>
      )}
      {keyboardVisible && (
        <div className='keyboard-container'>
          <Keyboard
            className='keyboard'
            onChange={onChange}
            onKeyPress={onKeyPress}
            maxLength={30}
            theme={'hg-theme-default darkTheme'}
            display={{
              '{bksp}': 'BACKSPACE',
              '{enter}': 'ENTER',
              '{space}': 'SPACE',
              '{symbols}': '.!?',
              '{abc}': 'ABC',
            }}
            layout={{
              default: [
                '1 2 3 4 5 6 7 8 9 0',
                'Q W E R T Y U I O P Å',
                'A S D F G H J K L Ø Æ',
                'Z X C V B N M {bksp}',
                '{symbols} {space} {enter}',
              ],
              symbols: [
                "- / : ; ( ) $ & @",
                ". , ? ! ' \" \\ `",
                "[ ] { } # % ^ * + =",
                "_ \\ | ~ < > € £ ¥ {bksp}",
                "{abc} {space} {enter}",
              ],
            }}
            layoutName={layout}
          />
        </div>
      )}
    </div>
  );
};

export default FinishedDrawing;
