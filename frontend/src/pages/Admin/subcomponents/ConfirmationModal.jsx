// frontend/src/pages/Admin/subcomponents/ConfirmationModal.jsx
import React from 'react';

const ConfirmationModal = ({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel
}) => {
  // Evitar la propagación de clics dentro del modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" onClick={handleModalClick}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="close-modal-btn" 
            onClick={onCancel}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <p className="confirmation-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          <div className="modal-actions">
            <button 
              className="btn-cancel" 
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              className="btn-confirm" 
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;