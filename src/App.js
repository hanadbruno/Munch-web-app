import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Startingpage from './components/Startingpage';
import DrawingPage from './components/DrawingPage';
import DrawingBoard from './components/DrawingBoard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startingpage />} />
        <Route path="/DrawingPage" element={<DrawingPage />} />
        <Route path="/DrawingBoard"element={<DrawingBoard />} />
      </Routes>
    </Router>
  );
};

export default App;
