import { useNavigate } from 'react-router-dom';
import "../App.css";

function App() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/DrawingPage');
  };

  return (
    <div className="container">
      <button className="start-button" onClick={handleStartClick}>
        START
      </button>
    </div>
  );
}

export default App;
