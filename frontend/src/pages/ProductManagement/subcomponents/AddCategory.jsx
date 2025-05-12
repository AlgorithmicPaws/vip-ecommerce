import React, { useState } from "react";

const AddCategory = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSave = () => {
    if (categoryName.trim()) {
      // Aquí puedes manejar la lógica para guardar la categoría
      onClose(); // Cierra el pop-up después de guardar
    } else {
      alert("El nombre de la categoría no puede estar vacío.");
    }
  };

  return (
    <div className="add-category-modal">
      <div className="modal-content">
        <h2>Añadir Categoría</h2>
        <div className="modal-actions">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
