import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartingPage from './components/StartingPage';
import DrawingPage from './components/DrawingPage';
import ExitPage from './components/ExitPage';
import FinishDrawing from './components/FinishedDrawing';
import React from 'react';

const App = () => {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Startingpage />} />
        <Route path="/DrawingPage" element={<DrawingPage />} />
        <Route path="/ExitPage" element={<ExitPage />} />
        <Route path="/FinishedDrawing" element={<FinishDrawing />} />
=======
        <Route path='/' element={<StartingPage />} />
        <Route path='/DrawingPage' element={<DrawingPage />} />
        <Route path='/ExitPage' element={<ExitPage />} />
        <Route path='/FinishedDrawing' element={<FinishDrawing />} />

>>>>>>> d36651784957827ff14f47991fb0fd88eea61d63
      </Routes>
    </Router>
  );
};

export default App;
