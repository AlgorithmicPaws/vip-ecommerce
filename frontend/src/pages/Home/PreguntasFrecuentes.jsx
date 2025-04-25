import { useState } from "react";
import { Link } from "react-router-dom";

const PreguntasFrecuentes = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "¿Cuánto tarda el envío?",
      answer: "Nuestros envíos tienen un plazo de entrega de 24-48h para península. Para zonas insulares, el plazo es de 3-5 días laborables."
    },
    {
      id: 2,
      question: "¿Tienen descuentos para profesionales?",
      answer: "Sí, ofrecemos precios especiales para profesionales registrados según volumen de compra."
    },
    {
      id: 3,
      question: "¿Ofrecen factura con IVA desglosado?",
      answer: "Sí, emitimos facturas completas con IVA desglosado para todas las compras. Las encontrarás en tu área de cliente."
    },
    {
      id: 4,
      question: "¿Cómo puedo devolver un producto?",
      answer: "Dispones de 30 días para devoluciones. Puedes gestionar todo el proceso desde tu área de cliente."
    }
  ];

  const toggleQuestion = (id) => {
    if (activeQuestion === id) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(id);
    }
  };

  return (
    <section className="faq-section">
      <div className="section-header">
        <h2>Preguntas Frecuentes</h2>
      </div>
      <div className="faq-list">
        {faqs.map(faq => (
          <div key={faq.id} className="faq-item">
            <div 
              className={`faq-question ${activeQuestion === faq.id ? 'active' : ''}`}
              onClick={() => toggleQuestion(faq.id)}
            >
              {faq.question}
              <span className="faq-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  {activeQuestion === faq.id ?
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    :
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                  }
                </svg>
              </span>
            </div>
            {activeQuestion === faq.id && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreguntasFrecuentes;