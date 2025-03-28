const CartCouponSection = ({couponCode, setCouponCode, handleApplyCoupon}) => {
  return (
    <div className="coupon-section">
      <h3>¿Tienes un Cupón?</h3>
      <div className="coupon-input">
        <input
          type="text"
          placeholder="Código de descuento"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button onClick={handleApplyCoupon}>Aplicar</button>
      </div>
      <p className="coupon-hint">Prueba con: CONSTRU20</p>
    </div>
  );
};

export default CartCouponSection;
