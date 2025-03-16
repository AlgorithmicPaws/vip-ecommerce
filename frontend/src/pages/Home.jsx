import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Bienvenido a ConstructMarket</h1>
        <p>El marketplace especializado en productos de construcción</p>
        <div className="button-group">
          <button onClick={() => navigate("/catalog")} className="home-button catalog-button">
            Ver Catálogo de Productos
          </button>
          <button onClick={() => navigate("/login")} className="home-button">
            Iniciar Sesión / Registrarse
          </button>
          <button
            onClick={() => navigate("/products")}
            className="home-button admin-button"
          >
            Administrar Productos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;