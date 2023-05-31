import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Startingpage from './components/Startingpage';
import DrawingPage from './components/DrawingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startingpage />} />
        <Route path="/DrawingPage" element={<DrawingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
