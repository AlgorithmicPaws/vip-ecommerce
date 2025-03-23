import { useState } from "react";
const Beneficios = () => {
    // Estado para valor añadido/beneficios
  const [benefits, setBenefits] = useState([
    { id: 1, title: "Envío Rápido", description: "Entrega en 24/48h en toda la península", icon: "🚚" },
    { id: 2, title: "Soporte Técnico", description: "Asesoramiento profesional para tus proyectos", icon: "👷‍♂️" },
    { id: 3, title: "Garantía de Calidad", description: "Todos nuestros productos cuentan con garantía", icon: "✅" },
    { id: 4, title: "Devoluciones Fáciles", description: "30 días para devoluciones sin complicaciones", icon: "↩️" }
  ]);
  
  return (
    <section className="benefits-section">
        <div className="benefits-grid">
          {benefits.map(benefit => (
            <div key={benefit.id} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
    </section>
  );
};

export default Beneficios;