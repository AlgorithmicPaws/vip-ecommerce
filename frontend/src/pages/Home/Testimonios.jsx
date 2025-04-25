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
      initial: "C",
      text: "VIP ha simplificado nuestra cadena de suministro. Precios competitivos y entrega puntual en obra.",
      rating: 5
    },
    {
      id: 2,
      name: "Laura Gómez",
      role: "Arquitecta",
      company: "Estudio LG Arquitectura",
      avatar: null,
      initial: "L",
      text: "La calidad de los materiales es excepcional. Mis clientes están encantados con los acabados que consigo.",
      rating: 4
    },
    {
      id: 3,
      name: "Alejandro Torres",
      role: "Instalador",
      company: "Instalaciones Torres",
      avatar: null,
      initial: "A",
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
                    <span>{testimonial.initial}</span>
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
                <span key={index} className={`star ${index < testimonial.rating ? 'filled' : 'empty'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
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