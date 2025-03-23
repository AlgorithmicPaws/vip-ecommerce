import { useState } from "react";
const Marcas = () => {
    // Estado para marcas colaboradoras
  const [brands, setBrands] = useState([
    "Bosch", "DeWalt", "Makita", "Stanley", "Pladur", "Knauf", "Leroy Merlin", "3M", "Hilti", "Milwaukee"
  ]);
  return (
    <section className="brands-section">
        <div className="section-header">
          <h2>Nuestras Marcas</h2>
        </div>
        <div className="brands-slider">
          {brands.map((brand, index) => (
            <div key={index} className="brand-item">
              <span>{brand}</span>
            </div>
          ))}
        </div>
      </section>
  );
};

export default Marcas;