import React, { useState } from 'react';
import './ProgressBar.css'; // Import the CSS file

const ProgressBar = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleClick = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="progress-bar-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${currentStep >= index + 1 ? 'completed' : ''}`}
          onClick={() => handleClick(index + 1)}
        >
          <div className="circle">{index + 1}</div>
          <div className="label"><b>{step}</b></div>
          {index < steps.length - 1 && <div className="line"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
