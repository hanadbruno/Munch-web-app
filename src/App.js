import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartingPage from './components/StartingPage';
import DrawingPage from './components/DrawingPage';
import ExitPage from './components/ExitPage';
import FinishDrawing from './components/FinishedDrawing';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartingPage />} />
        <Route path="/DrawingPage" element={<DrawingPage />} />
        <Route path="/ExitPage" element={<ExitPage />} />
        <Route path="/FinishedDrawing" element={<FinishDrawing />} />

      </Routes>
    </Router>
  );
};

export default App;
