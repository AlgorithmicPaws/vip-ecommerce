// frontend/src/pages/Admin/components/TopProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TopProducts = () => {
  // Datos de productos más vendidos (simulados)
  const topProducts = [
    {
      id: 1,
      name: 'Taladro DeWalt 20V',
      image: null, // En un caso real tendríamos la imagen
      price: 199.99,
      sold: 145,
      revenue: 28998.55,
      stock: 32
    },
    {
      id: 2,
      name: 'Sierra Circular Bosch',
      image: null,
      price: 159.99,
      sold: 128,
      revenue: 20478.72,
      stock: 25
    },
    {
      id: 3,
      name: 'Juego de Destornilladores Stanley',
      image: null,
      price: 49.99,
      sold: 312,
      revenue: 15596.88,
      stock: 75
    },
    {
      id: 4,
      name: 'Martillo Stanley FatMax',
      image: null,
      price: 29.99,
      sold: 267,
      revenue: 8007.33,
      stock: 120
    },
    {
      id: 5,
      name: 'Caja de Herramientas Profesional',
      image: null,
      price: 89.99,
      sold: 98,
      revenue: 8819.02,
      stock: 42
    }
  ];

  // Renderizar el stock con indicador de color
  const renderStock = (stock) => {
    let className = "stock-indicator ";
    if (stock <= 20) {
      className += "low";
    } else if (stock <= 50) {
      className += "medium";
    } else {
      className += "high";
    }

    return (
      <div className="stock-container">
        <div className={className}></div>
        <span>{stock} unidades</span>
      </div>
    );
  };

  return (
    <div className="top-products-card">
      <div className="card-header">
        <h3 className="card-title">Productos Más Vendidos</h3>
        <Link to="/admin/reports/products" className="view-all-link">
          Ver reporte completo
        </Link>
      </div>
      
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Vendidos</th>
              <th>Ingresos</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map(product => (
              <tr key={product.id}>
                <td className="product-cell">
                  <div className="product-info">
                    <div className="product-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className="image-placeholder">
                          <span>{product.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <Link to={`/admin/products/${product.id}`} className="product-name">
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.sold} uds.</td>
                <td className="revenue">${product.revenue.toFixed(2)}</td>
                <td>{renderStock(product.stock)}</td>
                <td>
                  <div className="table-actions">
                    <Link to={`/admin/products/${product.id}`} className="view-btn" title="Ver detalles">
                      👁️
                    </Link>
                    <Link to={`/admin/products/${product.id}/edit`} className="edit-btn" title="Editar">
                      ✏️
                    </Link>
                    <button className="more-btn" title="Más opciones">
                      ⋮
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;