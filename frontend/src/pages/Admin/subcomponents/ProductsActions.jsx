// frontend/src/pages/Admin/subcomponents/ProductsActions.jsx
import React, { useState } from 'react';

const ProductsActions = ({ selectedCount, onDelete, onUpdateStatus }) => {
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  return (
    <div className="bulk-actions-bar">
      <div className="selection-info">
        <span className="selected-count">{selectedCount}</span> productos seleccionados
      </div>
      
      <div className="actions-container">
        <div className="main-actions">
          <button 
            className="bulk-action-btn delete"
            onClick={onDelete}
            title="Eliminar seleccionados"
          >
            🗑️ Eliminar
          </button>
          
          <button 
            className="bulk-action-btn status"
            onClick={() => setShowBulkActions(!showBulkActions)}
          >
            ⚙️ Cambiar Estado <span className="dropdown-arrow">▼</span>
          </button>
          
          <button 
            className="bulk-action-btn"
            title="Exportar seleccionados"
          >
            📤 Exportar
          </button>
        </div>
        
        {showBulkActions && (
          <div className="status-dropdown">
            <button 
              className="status-option"
              onClick={() => onUpdateStatus('active')}
            >
              <span className="status-dot active"></span> Marcar como Activos
            </button>
            <button 
              className="status-option"
              onClick={() => onUpdateStatus('out_of_stock')}
            >
              <span className="status-dot out-of-stock"></span> Marcar Sin Stock
            </button>
            <button 
              className="status-option"
              onClick={() => onUpdateStatus('disabled')}
            >
              <span className="status-dot disabled"></span> Desactivar Productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsActions;