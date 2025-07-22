import { useEffect, useState } from "react";

const InformationProductDetail = () => {
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const orderDataString = localStorage.getItem("checkoutData");
    if (orderDataString) {
      try {
        const orderData = JSON.parse(orderDataString);
        
        const items = orderData.items.map((item) => {
  console.log("item raw:", item);
  return {
    id: item.cart_item_id,
    name: item.name,
    image: item.image || "/placeholder.svg",
    quantity: item.quantity || 1,
    unit_price: item.unit_price || 0, 
  };
});

        setProducts(items);
        setSubtotal(orderData.subtotal || 0);
        setDiscount(orderData.discount || 0);
        setShippingFee(orderData.shippingCost || 0);
        setTotal(orderData.total || 0);
      } catch (error) {
        console.error("Lỗi parse dữ liệu đơn hàng từ localStorage:", error);
      }
    }
  }, []);

  return (
    <div className="right-section-information-order">
      <div className="product-section-information-order">
        <h3>Products</h3>
        <div className="product-list-information-order">
          {products.length === 0 ? (
            <p>Không có sản phẩm trong đơn hàng.</p>
          ) : (
            products.map((product, index) => (
              <div
                key={`${product.id || index}`}
                className="product-item-information-order"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image-information-order"
                />
                <div className="product-details-information-order">
                  <h4>{product.name}</h4>
                  <p className="quantity-information-order">
                    Quantity: {product.quantity}
                  </p>
                  <div className="price-container-information-order">
                    <span className="current-price-information-order">
                      ${
                        !isNaN(Number(product.unit_price)) && !isNaN(Number(product.quantity))
                          ? (Number(product.unit_price) * Number(product.quantity)).toFixed(2)
                          : "0.00"
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="order-summary-information-order">
        <h3>Order Summary</h3>
        <div className="summary-row-information-order">
          <span>Subtotal</span>
          <span className="price-blue-information-order">${subtotal.toFixed(2)}</span>
        </div>
        {discount !== 0 && (
          <div className="summary-row-information-order">
            <span>Discount</span>
            <span className="price-blue-information-order">-${Math.abs(discount).toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row-information-order">
          <span>Shipping Fee</span>
          <span className="price-blue-information-order">${shippingFee.toFixed(2)}</span>
        </div>
        <div className="summary-row-information-order total">
          <span>Total</span>
          <span className="price-blue-information-order">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InformationProductDetail;
