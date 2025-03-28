import React from 'react';

const ConfirmationModal = ({ 
  title, 
  message, 
  confirmText, 
  cancelText, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-modal" onClick={onCancel}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p className="confirmation-message">{message}</p>
        </div>
        <div className="modal-actions">
          <button 
            className="cancel-btn"
            onClick={onCancel}
          >
            {cancelText || 'Cancelar'}
          </button>
          <button 
            className="confirm-btn"
            onClick={onConfirm}
          >
            {confirmText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;