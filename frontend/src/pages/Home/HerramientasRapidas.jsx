import { useState } from "react";
const HerramientasRapidas = ({navigate}) => {
    // Estado para herramientas/calculadoras rápidas
    const [quickTools, setQuickTools] = useState([
        { id: 1, name: "Calculadora de Materiales", icon: "🧮", link: "/calculators/materials" },
        { id: 2, name: "Planificador de Proyectos", icon: "📋", link: "/tools/project-planner" },
        { id: 3, name: "Estimador de Presupuesto", icon: "💰", link: "/calculators/budget" },
        { id: 4, name: "Convertidor de Medidas", icon: "📏", link: "/tools/measurements" }
      ]);

  return (
    <section className="quick-tools-section">
        <div className="section-header">
          <h2>Herramientas para Profesionales</h2>
        </div>
        <div className="tools-grid">
          {quickTools.map(tool => (
            <div key={tool.id} className="tool-card" onClick={() => navigate(tool.link)}>
              <div className="tool-icon">{tool.icon}</div>
              <h3>{tool.name}</h3>
              <span className="tool-cta">Usar ahora →</span>
            </div>
          ))}
        </div>
      </section>
  );
};

export default HerramientasRapidas;