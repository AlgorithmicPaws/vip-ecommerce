const TabsDescription = ({product, showMoreDescription, setShowMoreDescription}) => {
  return (
    <div className="tab-description">
      <div
        className={`description-content ${
          showMoreDescription ? "expanded" : ""
        }`}
      >
        {product.description.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        <div className="features-list">
          <h3>Características Destacadas</h3>
          <ul>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      {product.description.length > 500 && (
        <button
          className="show-more-btn"
          onClick={() => setShowMoreDescription(!showMoreDescription)}
        >
          {showMoreDescription ? "Mostrar menos" : "Mostrar más"}
        </button>
      )}
    </div>
  );
};

export default TabsDescription;
