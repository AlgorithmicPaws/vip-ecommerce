import React from 'react';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, name: 'Dirección de Envío' },
    { number: 2, name: 'Método de Pago' },
    { number: 3, name: 'Revisar Pedido' }
  ];

  return (
    <div className="checkout-steps">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="steps-list">
        {steps.map((step) => (
          <div 
            key={step.number}
            className={`step ${step.number === currentStep ? 'active' : ''} ${step.number < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">
              {step.number < currentStep ? '✓' : step.number}
            </div>
            <div className="step-name">{step.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;