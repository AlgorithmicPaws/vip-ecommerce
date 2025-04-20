import { Link } from "react-router-dom";

const CategoriasSection = ({ navigate }) => {
  // Categorías principales
  const categories = [
    { 
      id: 1, 
      name: "Herramientas Eléctricas", 
      count: 48,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2 14c0 .547-.453 1-1 1H3c-.547 0-1-.453-1-1V2c0-.547.453-1 1-1h10c.547 0 1 .453 1 1v12z"/>
        <path d="M6.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm-1 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm-1 3h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1z"/>
      </svg>
    },
    { 
      id: 2, 
      name: "Herramientas Manuales", 
      count: 36,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.416.223a.5.5 0 0 0-.832 0l-3 4.5a.5.5 0 0 0 .832.554L7.651 2h.7l2.235 3.277a.5.5 0 0 0 .832-.554l-3-4.5z"/>
        <path d="M6.5 1.018a.5.5 0 0 0-.5.5V3.5a.5.5 0 0 0 1 0V1.518a.5.5 0 0 0-.5-.5z"/>
        <path d="M7.146 6.354l.854-.853a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0c-.488.488-1.628 1.628-2 2a1.9 1.9 0 0 1-.486-.437c-.291-.29-.98-.98-1.553-1.553a.5.5 0 1 0-.707.707c.988.987 2.328 2.327 2.637 2.636.396.396.576.953.576 1.5V8a2.5 2.5 0 0 0 5 0V6.707a.498.498 0 0 0-.067-.154.5.5 0 0 0-.221-.224zM8 8a1.5 1.5 0 0 1-3 0V6.9c0-.873-.299-1.719-.88-2.3L6.586 2.132A.998.998 0 0 1 7 2v2.134l1 1V6a2 2 0 0 1 0 2z"/>
      </svg>
    },
    { 
      id: 3, 
      name: "Material de Construcción", 
      count: 52,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2z"/>
      </svg>
    },
    { 
      id: 4, 
      name: "Electricidad", 
      count: 29,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
      </svg>
    },
    { 
      id: 5, 
      name: "Fontanería", 
      count: 31,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.5 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
        <path d="M3 0a2 2 0 0 0-2 2v13.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v13.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V2a2 2 0 0 0-2-2H3zm0 1h10a1 1 0 0 1 1 1v13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V2a1 1 0 0 0-1-1H3z"/>
      </svg>
    },
    { 
      id: 6, 
      name: "Seguridad", 
      count: 18,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z"/>
      </svg>
    }
  ];

  return (
    <section className="categories-section">
      <div className="section-container">
        <div className="section-header">
          <div>
            <h2>Categorías Principales</h2>
            <p className="section-subtitle">Explora nuestras categorías de productos para tu proyecto</p>
          </div>
          <Link to="/catalog" className="view-all-link">Ver todas →</Link>
        </div>
        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => navigate(`/catalog?category=${category.name}`)}
            >
              <div className="category-icon">
                {category.icon}
              </div>
              <h3>{category.name}</h3>
              <p>{category.count} productos</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriasSection;