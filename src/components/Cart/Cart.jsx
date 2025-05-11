import Navbar from "../layout/navbar";
import "@assets/css/cart.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateCartQuantity,
  removeFromCart,
  updateCartInv,
} from "@redux/Actions/cartActions";
import { isAuth, getToken, getCurrentUser } from "@utils/helpers";
import baseURL from "@Commons/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { memberDetails } from "@redux/Actions/memberActions";
import { FaInfoCircle } from "react-icons/fa";
import React, { useEffect, useState } from "react";

const SHIPPING_FEE = 75;
const TAX_RATE = 0.12;

const Carts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = isAuth();
  const token = getToken();
  const cUser = getCurrentUser();
  const cartItems = useSelector((state) => state.cartItems);
  const { loading, members, error } = useSelector((state) => state.memberList);
  const approvedMember = members?.filter(
    (member) => member.approvedAt !== null
  );
  const coopId = approvedMember?.map((member) => member.coopId?._id) || [];
  const userId = cUser?._id;

  const subtotal = cartItems.reduce((acc, item) => {
    console.log("Item: ", item);
    const itemTotal = item.pricing * item.quantity;
    console.log("Item Total: ", itemTotal);
  
    if (coopId !== item.coop) {
      return acc + itemTotal;
    }
    
    return acc;
  }, 0);

  useEffect(() => {
    const membering = async () => {
      try {
        dispatch(memberDetails(userId, token));
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };
    membering();
  }, []);

  const [isTaxModalVisible, setIsTaxModalVisible] = useState(false); // State for modal visibility

  const handleTaxInfo = () => {
    setIsTaxModalVisible(true); // Show the modal
  };

  const closeTaxModal = () => {
    setIsTaxModalVisible(false); // Hide the modal
  };

  const calculateShipping = () => {
    const uniqueCoops = new Set();
    cartItems.forEach((item) => {
      if (item?.coop) {
        uniqueCoops.add(item.coop);
      }
    });

    const shippingCost = uniqueCoops.size * 75;

    return shippingCost;
  };

  const calculateTax = () => {
    const hasNonMemberItem = cartItems.some(
      (item) => item?.coop && !coopId.includes(item.coop)
    );
    return hasNonMemberItem ? 0.12 : 0;
  };

  const calculateFinalTotal = () => {
    const shippingCost = calculateShipping();

    let taxableTotal = 0;
    let nonTaxableTotal = 0;

    cartItems.forEach((item) => {
      
      const itemTotal = item.pricing * item.quantity;
      if (!coopId.includes(item.coop)) {
        taxableTotal += itemTotal;
      } else {
        nonTaxableTotal += itemTotal;
      }
    });

    const taxAmount = taxableTotal * 0.12;
    const finalTotal =
      taxableTotal + nonTaxableTotal + taxAmount + shippingCost;

    return finalTotal.toFixed(2);
  };
  
  const subtax = () => {

    let taxableTotal = 0;

  cartItems.forEach((item) => {
      
      const itemTotal = item.pricing * item.quantity;
      if (!coopId.includes(item.coop)) {
        taxableTotal += itemTotal;
      } 
    });

   return taxableTotal;
  }

  const handleIncrement = (item) => {
    if (item?.quantity < item?.maxQuantity) {
      dispatch(updateCartQuantity(item?.inventoryId, item?.quantity + 1));
    }
  };

  const handleDecrement = (item) => {
    if (item?.quantity > 1) {
      dispatch(updateCartQuantity(item?.inventoryId, item?.quantity - 1));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.inventoryId));
  };

  

  const isLoggedIn = () => {
    navigate("/login?redirect=shippings");
  };

  const checkoutHandler = async () => {

    if( !auth ) {
      return isLoggedIn();
    } 
    
    const taxAmount = calculateTax();
    const totalPrice = parseFloat(calculateFinalTotal());

    const orderItems = {
      orderItems: cartItems.map((item) => ({
        product: item.productId,
        inventoryId: item.inventoryId,
        quantity: item.quantity,
      })),
      subtotal,
      tax: taxAmount.toFixed(2),
      shippingFee: SHIPPING_FEE,
      totalPrice: totalPrice.toFixed(2),
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

      if (data?.details?.success === true) {
        toast.success("Order placed successfully!");
        navigate("/shipping");
      } else {
        data?.details?.lowStockItems?.forEach((item) => {
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
                        {item.productName}
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
                        className="text-red-600 hover:underline"
                        onClick={() => handleRemove(item)}
                      >
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
              <p className="total-text">Subtotal: ₱ {subtotal.toFixed(2)}</p>
              <p
                className="total-text"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Tax: ₱ {(subtax() * calculateTax()).toFixed(2)}
                <FaInfoCircle
                  style={{
                    cursor: "pointer",
                    color: "#007bff",
                    fontSize: "14px",
                  }}
                  onClick={handleTaxInfo}
                />
              </p>

              <p className="total-text">
                Shipping Fee: ₱ {calculateShipping().toFixed(2)}
              </p>
              <p className="total-text">Total: ₱ {calculateFinalTotal()}</p>
            </div>
          )}
          {/* Tax Info Modal */}
          {isTaxModalVisible && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Tax Information</h2>
                <p>
                  This tax applies to users who are not members of any
                  cooperative. If you want to save on future purchases, consider
                  registering as a member.
                </p>
                <button className="modal-ok-btn" onClick={closeTaxModal}>
                  OK
                </button>
              </div>
            </div>
          )}
          <div className="button-row">
            <a href="/" className="button-proceed-checkout">
              Continue Shopping
            </a>
            <button
              onClick={cartItems.length > 0 ? checkoutHandler : null}
              className={`button-proceed-checkout ${cartItems.length === 0 ? 'disabled' : ''}`}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carts;
