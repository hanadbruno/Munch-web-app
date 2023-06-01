import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Startingpage from './components/Startingpage';
import DrawingPage from './components/DrawingPage';
import ExitPage from './components/ExitPage';
import FinishDrawing from './components/FinishedDrawing';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startingpage />} />
        <Route path="/DrawingPage" element={<DrawingPage />} />
        <Route path="/ExitPage" element={<ExitPage />} />
        <Route path="/FinishedDrawing" element={<FinishDrawing />} />

      </Routes>
    </Router>
  );
};

export default App;
