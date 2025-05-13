import React, { useState, useEffect } from "react";
import { createCategory, getCategories } from "../../../services/categoryService";

const AddCategory = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  // Cargar las categorías existentes al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories(); // Obtiene la lista de categorías
        setCategories(categories); // Asigna la lista al estado
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (categoryName.trim()) {
      // Verificar si la categoría ya existe
      const categoryExists = categories.some(
        (category) => category.name.toLowerCase() === categoryName.toLowerCase()
      );

      if (categoryExists) {
        alert("La categoría ya existe.");
        return;
      }

      try {
        // Crear la nueva categoría
        await createCategory({ name: categoryName });
        alert("Categoría creada exitosamente.");

        // Recargar las categorías después de crear una nueva
        const updatedCategories = await getCategories();
        setCategories(updatedCategories);

        onClose(); // Cierra el pop-up después de guardar
      } catch (error) {
        console.error("Error al crear la categoría:", error);
        alert("Hubo un error al crear la categoría. Inténtalo de nuevo.");
      }
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