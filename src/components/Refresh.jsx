// Common ancestor component
import React, { useState } from 'react';
import Drawing from './Drawing';
import ExitPage from './ExitPage';

const Refresh = () => {
  const [drawingState, setDrawingState] = useState({
    // initial state values for Drawing component
  });

  const resetDrawingState = () => {
    setDrawingState({
      // reset state values for Drawing component
    });
  };

  return (
    <>
      <Drawing drawingState={drawingState} setDrawingState={setDrawingState} />
      <ExitPage resetDrawingState={resetDrawingState} />
    </>
  );
};

export default Refresh;