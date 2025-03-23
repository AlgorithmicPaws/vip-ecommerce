import { Link } from "react-router-dom";
const CategoriasSection = ({navigate}) =>{

    // Estado para categorías (No es necesario el use state)
      const categories = [
        { id: 1, name: "Herramientas Eléctricas", icon: "🔌", count: 48 },
        { id: 2, name: "Herramientas Manuales", icon: "🔨", count: 36 },
        { id: 3, name: "Material de Construcción", icon: "🧱", count: 52 },
        { id: 4, name: "Electricidad", icon: "💡", count: 29 },
        { id: 5, name: "Fontanería", icon: "🚿", count: 31 },
        { id: 6, name: "Seguridad", icon: "🦺", count: 18 }
      ];

    return(
        <section className="categories-section">
        <div className="section-header">
          <h2>Categorías Principales</h2>
          <Link to="/catalog" className="view-all-link">Ver todas</Link>
        </div>
        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => navigate(`/catalog?category=${category.name}`)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.count} productos</p>
            </div>
          ))}
        </div>
      </section>
    )
}
export default CategoriasSection;