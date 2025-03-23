import { Link } from "react-router-dom";
const PreguntasFrecuentes = () => {
  return (
    <section className="faq-section">
        <div className="section-header">
          <h2>Preguntas Frecuentes</h2>
        </div>
        <div className="faq-columns">
          <div className="faq-column">
            <div className="faq-item">
              <h3>¿Cuánto tarda el envío?</h3>
              <p>Nuestros envíos tienen un plazo de entrega de 24-48h para península. Para zonas insulares, el plazo es de 3-5 días laborables.</p>
            </div>
            <div className="faq-item">
              <h3>¿Ofrecen factura con IVA desglosado?</h3>
              <p>Sí, emitimos facturas completas con IVA desglosado para todas las compras. Las encontrarás en tu área de cliente.</p>
            </div>
          </div>
          <div className="faq-column">
            <div className="faq-item">
              <h3>¿Tienen descuentos para profesionales?</h3>
              <p>Sí, ofrecemos precios especiales para profesionales registrados según volumen de compra.</p>
            </div>
            <div className="faq-item">
              <h3>¿Cómo puedo devolver un producto?</h3>
              <p>Dispones de 30 días para devoluciones. Puedes gestionar todo el proceso desde tu área de cliente.</p>
            </div>
          </div>
        </div>
        <div className="faq-more">
          <Link to="/faq" className="view-all-link">Ver todas las preguntas</Link>
        </div>
      </section>
  );
};

export default PreguntasFrecuentes;