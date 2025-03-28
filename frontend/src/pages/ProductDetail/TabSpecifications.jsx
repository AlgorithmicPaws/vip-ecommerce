const TabSpecifications = ({product, showMoreSpecs}) => {
  return (
    <div className="tab-specifications">
      <div
        className={`specifications-content ${showMoreSpecs ? "expanded" : ""}`}
      >
        <table className="specs-table">
          <tbody>
            {product.specifications.map((spec, index) => (
              <tr key={index}>
                <td className="spec-name">{spec.name}</td>
                <td className="spec-value">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {product.specifications.length > 6 && (
        <button
          className="show-more-btn"
          onClick={() => setShowMoreSpecs(!showMoreSpecs)}
        >
          {showMoreSpecs ? "Mostrar menos" : "Mostrar más"}
        </button>
      )}

      <div className="certifications">
        <h3>Certificaciones</h3>
        <div className="cert-list">
          {product.certification.map((cert, index) => (
            <span key={index} className="cert-item">
              {cert}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabSpecifications;
