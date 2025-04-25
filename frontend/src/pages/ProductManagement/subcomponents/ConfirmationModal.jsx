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
        <div className="modal-header" style={{ backgroundColor: '#F2A900', color: '#000' }}>
          <h2>{title}</h2>
          <button className="close-modal" onClick={onCancel} style={{ color: '#000' }}>
            &times;
          </button>
        </div>
        <div className="modal-body" style={{ padding: '20px' }}>
          <p className="confirmation-message">{message}</p>
        </div>
        <div className="modal-actions" style={{ padding: '0 20px 20px' }}>
          <button 
            className="cancel-btn"
            onClick={onCancel}
            style={{
              backgroundColor: '#f0f0f0',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {cancelText || 'Cancelar'}
          </button>
          <button 
            className="confirm-btn"
            onClick={onConfirm}
            style={{
              backgroundColor: '#F2A900',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {confirmText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;