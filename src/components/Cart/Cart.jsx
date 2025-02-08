import Navbar from "../layout/navbar";
import "@assets/css/cart.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateCartQuantity,
  removeFromCart,
  updateCartInv,
} from "@redux/Actions/cartActions";
import { isAuth, getToken } from "@utils/helpers";
import baseURL from "@Commons/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const Carts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = isAuth();
  const token = getToken();
  const cartItems = useSelector((state) => state.cartItems);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.pricing * item.quantity,
    0
  );
  console.log("Cart Items:", cartItems);

  const handleIncrement = (item) => {
    if (item?.quantity < item?.maxQuantity) {
      dispatch(updateCartQuantity(item?.inventoryId, item?.quantity + 1));
    }
  };

  const handleDecrement = (item) => {
    console.log(item?.quantity);
    if (item?.quantity > 1) {
      dispatch(updateCartQuantity(item?.inventoryId, item?.quantity - 1));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.inventoryId));
  };

  const checkoutHandler = async () => {
    const orderItems = {
      orderItems: cartItems.map((item) => ({
        product: item.productId,
        inventoryId: item.inventoryId,
        quantity: item.quantity,
      })),
      totalPrice,
    };

    try {
      const { data } = await axios.post(
        `${baseURL}inventory/stock`,
        orderItems,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("Checkout Data:", data);
      if (data?.details?.success === true) {
        toast.success("Order placed successfully!");
        navigate("/shipping");
      } else {
        data?.details?.lowStockItems?.forEach((item) => {
          console.log("Low Stock Item:", item);
          if (item.reason === "out_of_stock") {
            toast.error(
              `${item.productName} ${item.unitName} ${item.metricUnit} is out of stock and has been removed from your cart.`
            );
            dispatch(removeFromCart(item.inventoryId));
          } else if (item.reason === "low_stock") {
            toast.warning(
              `Quantity for ${item.productName} ${item.unitName} ${item.metricUnit} has been adjusted to ${item.currentStock} due to stock availability.`
            );
            dispatch(
              updateCartInv(
                item.inventoryId,
                item.currentStock,
                item.currentStock
              )
            );
          }
        });
      }
    } catch (error) {
      toast.error("Something went wrong while placing the order.");
      console.error("Checkout Error:", error);
    }
  };

  const isLoggedIn = async () => {
    navigate("/login?redirect=shippings");
  };
  return (
    <section className="cart-section">
      <Navbar />
      <div className="cart-container">
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item, index) => (
                <div className="cart-item" key={index}>
                  <div className="cart-item-details">
                    <a href="#" className="cart-item-image">
                      <img
                        className="light-image"
                        src={item.image}
                        alt={item.name}
                      />
                    </a>
                    <div className="cart-item-info">
                      <a href="#" className="cart-item-title">
                        {item.productName} {""}
                      </a>
                      <a href="#" className="cart-item-title">
                        {item.unitName} {item.metricUnit}
                      </a>
                    </div>
                    <div className="cart-item-quantity">
                      <button
                        type="button"
                        className="quantity-btn decrement"
                        onClick={() => handleDecrement(item)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        className="quantity-input"
                        disabled
                      />
                      <button
                        type="button"
                        className="quantity-btn increment"
                        onClick={() => handleIncrement(item)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-price">₱ {item.pricing}</div>
                    <div className="cart-item-actions">
                      <button
                        type="button"
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                        onClick={() => handleRemove(item)}
                      >
                        <svg
                          className="me-1.5 h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18 17.94 6M18 18 6.06 6"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="cart-summary">
              <p className="total-text">Total: ₱ {totalPrice} </p>
            </div>
          )}

          <div className="button-row">
            <a href="/" className="button-proceed-checkout">
              Continue Shopping
            </a>
            {cartItems.length > 0 && auth && (
              <a href="/shipping"  className="button-proceed-checkout">
                Proceed to Checkout
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carts;
