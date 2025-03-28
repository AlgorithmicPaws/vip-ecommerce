const CartItems = ({item}) => {
  return (
    <div key={item.id} className="cart-item">
      <div className="item-product">
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
          <h3>{item.name}</h3>
          <p className="item-seller">
            Vendido por: {item.seller || "ConstructMax"}
          </p>
          {item.stock < 10 && (
            <p className="stock-warning">¡Solo quedan {item.stock} unidades!</p>
          )}
        </div>
      </div>

      <div className="item-price">${item.price.toFixed(2)}</div>

      <div className="item-quantity">
        <div className="quantity-control">
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={item.stock}
            value={item.quantity}
            onChange={(e) =>
              handleQuantityChange(item.id, parseInt(e.target.value) || 1)
            }
          />
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            +
          </button>
        </div>
      </div>

      <div className="item-total">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <div className="item-actions">
        <button
          className="remove-btn"
          onClick={() => removeFromCart(item.id)}
          aria-label="Eliminar producto"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CartItems;
