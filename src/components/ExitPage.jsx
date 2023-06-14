import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ExitPage.css";

const ExitPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const ip = process.env.REACT_APP_IP_ADD;
      window.location.assign(`http://${ip}:3000/`);
    }, 100); // 10000 milliseconds = 10 seconds

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts before the timeout
    };
  }, [navigate]);

  return (
    <div className="exit-body">
      <div className="exit-page-container">
        <div className="exit-page-box">
          <div>YOU ARE,</div>
          <div style={{ textIndent: "20px", paddingTop: "10px" }}>
            LIKE MUNCH,
          </div>
          <div style={{ textIndent: "30px", paddingTop: "10px" }}>
            A PART OF THE
          </div>
          <div style={{ textIndent: "40px", paddingTop: "10px" }}>
            CULTURAL HERITAGE
          </div>
          <div style={{ textIndent: "40px", paddingTop: "10px" }}>OF OSLO</div>
        </div>
      </div>
    </div>
  );
};

export default ExitPage;
