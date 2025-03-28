const CartSummaryRowDisc = () => {
  return (
    <div className="summary-row discount">
      <span>Descuento (Cupón)</span>
      <span>-${discount.toFixed(2)}</span>
    </div>
  );
};

export default CartSummaryRowDisc;
