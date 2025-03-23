import { useState } from "react";
const Testimonios = () => {
    // Estado para testimonios
      const [testimonials, setTestimonials] = useState([
        {
          id: 1,
          name: "Carlos Méndez",
          role: "Constructor",
          company: "Construcciones Méndez",
          avatar: null,
          text: "ConstructMarket ha simplificado nuestra cadena de suministro. Precios competitivos y entrega puntual en obra.",
          rating: 5
        },
        {
          id: 2,
          name: "Laura Gómez",
          role: "Arquitecta",
          company: "Estudio LG Arquitectura",
          avatar: null,
          text: "La calidad de los materiales es excepcional. Mis clientes están encantados con los acabados que consigo.",
          rating: 4
        },
        {
          id: 3,
          name: "Alejandro Torres",
          role: "Instalador",
          company: "Instalaciones Torres",
          avatar: null,
          text: "El servicio al cliente es inmejorable. Siempre encuentro lo que necesito y a buen precio.",
          rating: 5
        }
      ]);

  return (
    <section className="testimonials-section">
        <div className="section-header">
          <h2>Lo que dicen nuestros clientes</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  {testimonial.avatar ? (
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      <span>{testimonial.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {Array(5).fill(0).map((_, index) => (
                  <span key={index} className={`star ${index < testimonial.rating ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>
  );
};

export default Testimonios;