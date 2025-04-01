// frontend/src/pages/Admin/subcomponents/OrderItemsTable.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const OrderItemsTable = ({ items }) => {
  return (
    <div className="order-items-table-container">
      <table className="order-items-table">
        <thead>
          <tr>
            <th className="item-image-cell">Producto</th>
            <th>SKU</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Descuento</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="item-info-cell">
                <div className="item-info">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="image-placeholder">
                        <span>{item.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <Link 
                      to={`/admin/products/${item.productId}`} 
                      className="item-name"
                    >
                      {item.name}
                    </Link>
                    {item.attributes && item.attributes.length > 0 && (
                      <div className="item-attributes">
                        {item.attributes.map((attr, index) => (
                          <span key={index} className="attribute">
                            {attr}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td>{item.sku}</td>
              <td>${item.price.toFixed(2)}</td>
              <td className="item-quantity">{item.quantity}</td>
              <td className="item-discount">
                {item.discount > 0 ? (
                  `${item.discount}%`
                ) : (
                  '—'
                )}
              </td>
              <td className="item-total">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;