import React, { useState, useEffect } from "react";
import { createCategory, getCategories } from "../../../services/categoryService";
import Notification from "./Notification";// Ajusta la ruta según tu estructura

const AddCategory = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState({
    message: "",
    type: "", // 'success' o 'error'
    show: false
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        showNotification("Error al cargar las categorías", "error");
        console.error("Error al cargar las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const showNotification = (message, type) => {
    setNotification({
      message,
      type,
      show: true
    });
  };

  const closeNotification = () => {
    setNotification({
      message: "",
      type: "",
      show: false
    });
  };

  const handleSave = async () => {
  if (!categoryName.trim()) {
    showNotification("El nombre de la categoría no puede estar vacío.", "error");
    return;
  }

  // Verificar si la categoría ya existe
  const categoryExists = categories.some(
    (category) => category.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (categoryExists) {
    showNotification("La categoría ya existe.", "error");
    return;
  }

  try {
    // Crear la nueva categoría
    await createCategory({ name: categoryName });
    showNotification("Categoría creada exitosamente.", "success");

    // Recargar la página después de un pequeño retraso para que se vea la notificación
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (error) {
    showNotification("Hubo un error al crear la categoría. Inténtalo de nuevo.", "error");
    console.error("Error al crear la categoría:", error);
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
      
      {/* Mostrar notificación */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default AddCategory;