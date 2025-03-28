import { Link } from "react-router-dom";
const Breadcrumbs = ({product}) => {
  return (
    <div className="breadcrumbs">
      <Link to="/">Inicio</Link> &gt;
      <Link to="/catalog">Productos</Link> &gt;
      <Link to={`/catalog?category=${encodeURIComponent(product.category)}`}>
        {product.category}
      </Link>
      {product.subcategory && (
        <>
          &gt;
          <Link
            to={`/catalog?subcategory=${encodeURIComponent(
              product.subcategory
            )}`}
          >
            {product.subcategory}
          </Link>
        </>
      )}
      &gt; <span>{product.name}</span>
    </div>
  );
};

export default Breadcrumbs;