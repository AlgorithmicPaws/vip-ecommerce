const ProductStock = ({product}) => {
  return (
    <div className="product-stock">
      {product.stock > 10 ? (
        <div className="in-stock">✓ En stock</div>
      ) : product.stock > 0 ? (
        <div className="low-stock">
          ⚠ Pocas unidades disponibles ({product.stock})
        </div>
      ) : (
        <div className="out-of-stock">✗ Agotado</div>
      )}
    </div>
  );
};

export default ProductStock;
