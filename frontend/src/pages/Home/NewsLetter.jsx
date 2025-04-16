import { useState } from "react";
const NewsLetter = () => {
    const handleSubscribe = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de suscripción real
        if (email && email.includes('@')) {
          setIsSubscribed(true);
          setEmail('');
          setTimeout(() => setIsSubscribed(false), 5000);
        }
      };
  const [email, setEmail] = useState('');
  // Suscripción al newsletter
  const [isSubscribed, setIsSubscribed] = useState(false);
  return (
    <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Suscríbete a nuestro boletín</h2>
          <p>Recibe las últimas ofertas, novedades y consejos para tus proyectos</p>
          {isSubscribed ? (
            <div className="subscribe-success">
              ¡Gracias por suscribirte! Pronto recibirás nuestras novedades.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" className="subscribe-btn">Suscribirse</button>
            </form>
          )}
        </div>
      </section>
  );
};

export default NewsLetter;