import { useNavigate } from 'react-router-dom';
import '../css/StartingPage.css';

function StartingPage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/DrawingPage');
  };

  return (
    <div className='container'>
      <div className='main-text'>
        EDVARD MUNCH TESTAMENTED A LARGE PART OF HIS WORK TO THE CITY OF OSLO.
        THIS DONATION FORMED THE FOUNDATION FOR THE MUSEUM. HIS WORK IS OWNED BY
        THE PEOPLE, AND THEREFORE SO IS MUNCH. IN THIS SPIRIT OF SHARED
        OWNERSHIP, YOU ARE INVITED TO CONTRIBUTE YOUR ART.
      </div>
      <button className='start-button' onClick={handleStartClick}>
        START
      </button>
    </div>
  );
}

export default StartingPage;
