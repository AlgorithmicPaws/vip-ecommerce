import React from 'react';

const ProgressSteps = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="progress-steps">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="steps-labels">
        {steps.map((stepLabel, index) => (
          <div 
            key={index}
            className={`step ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <div className="step-label">{stepLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;