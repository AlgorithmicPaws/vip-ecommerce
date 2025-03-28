const CartSummaryRow = ({subtotal}) => {
  return (
    <div className="summary-row">
      <span>Subtotal</span>
      <span>${subtotal.toFixed(2)}</span>
    </div>
  );
};

export default CartSummaryRow;
