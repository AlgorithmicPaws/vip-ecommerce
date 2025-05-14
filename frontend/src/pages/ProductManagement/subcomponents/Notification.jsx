import React, { useEffect } from "react";
import "../../../styles/Notification.css"; // Crearemos este CSS después

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Cierra automáticamente después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">
        &times;
      </button>
    </div>
  );
};

export default Notification;