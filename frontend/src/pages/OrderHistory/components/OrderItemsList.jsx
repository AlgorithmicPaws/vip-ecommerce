import React from 'react';
import { Link } from 'react-router-dom';

const OrderItemsList = ({ items, formatPrice }) => {
  // Limit the number of items shown initially
  const maxItemsToShow = 3;
  const hasMoreItems = items.length > maxItemsToShow;
  const displayItems = items.slice(0, maxItemsToShow);
  
  return (
    <div className="order-items-list">
      <h3>Productos</h3>
      <div className="items-container">
        {displayItems.map((item) => (
          <div key={item.order_item_id} className="order-item">
            <div className="item-info">
              <Link 
                to={`/catalog/product/${item.product_id}`} 
                className="item-name"
              >
                {/* Try to show product name if available */}
                {item.name || `Producto #${item.product_id}`}
              </Link>
              <div className="item-details">
                <span className="item-quantity">
                  Cantidad: {item.quantity}
                </span>
                <span className="item-price">
                  ${formatPrice(item.price_per_unit)} c/u
                </span>
              </div>
            </div>
            <div className="item-subtotal">
              ${formatPrice(item.subtotal)}
            </div>
          </div>
        ))}
        
        {hasMoreItems && (
          <div className="more-items-note">
            + {items.length - maxItemsToShow} productos más
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItemsList;