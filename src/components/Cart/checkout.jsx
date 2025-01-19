import React, { Fragment, useState, useEffect } from 'react'
import "../../assets/css/checkout.css";
import Navbar from "../layout/navbar";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '@utils/helpers';
import { getToken } from '@utils/helpers';
import { toast } from 'react-toastify';
import { createOrder } from '@redux/Actions/orderActions';

const CheckoutAccordion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = getCurrentUser()?._id;
  const token = getToken();
  const payItems = useSelector((state) => state.payItems);
  const cartItems = useSelector((state) => state.cartItems);
  const shipItems = useSelector((state) => state.shipItems);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.pricing * item.quantity, 0);
  
  console.log("Cart Items:", cartItems);
  const confirmOrder = async () => {
   
    if (!payItems || !shipItems || !cartItems) {
      toast?.error("There is a problem to cart", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: 'unSuccess',  
        closeButton: false,
      });
      return; 
    }

    if (!userId || !token) {
      toast?.error("Please select a Payment Method to proceed.", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: 'unSuccess',  
        closeButton: false,
      });
      return; 
    }
  
   
    const orderData = {
      user: userId,
      orderItems: cartItems.map((item) => ({
        product: item?.productId,
        quantity: item?.quantity,
        price: item?.pricing,
        coopUser: item?.coop,
        inventoryProduct: item?.inventoryId,
      })),
      shippingAddress: shipItems?._id,
      paymentMethod: payItems?.paymentMethod,
      totalPrice: totalPrice,
    };
  
    try {
      const orderCreationResult = await dispatch(createOrder(orderData, token));
  
      if (orderCreationResult?.order) {
        toast?.success("Your order has been successfully placed!", {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: 'success', 
          closeButton: false,
        });
        navigate("/confirm")
      } else {
        toast?.error("Failed to place order. Please try again.", {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: 'unSuccess',  
          closeButton: false,
        });
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      toast?.error("Failed to place order. Please try again.", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: 'unSuccess',  
        closeButton: false,
      });
    }
  };

  
  return (
    <Fragment>
  <Navbar />
  <div className="checkout-container min-h-screen bg-gray-100">
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-screen-lg space-y-4 bg-white rounded shadow-lg p-6 overflow-y-auto">
  
        <div className="col-12 col-lg-7 order-details">
          <h4 className="mb-4 text-xl font-semibold text-black border-b pb-2">Shipping Info</h4>
          {user && (
            <p className="text-black">
              <b>Name:</b> {user.firstName}, {user.lastName}
            </p>
          )}
          <p className="text-black">
            <b>Address:</b> {`${shipItems?.address}, ${shipItems?.city}, ${shipItems?.postalCode}`}
          </p>
          <p className="text-black">
            <b>Payment Method:</b> {payItems.paymentMethod}
          </p>
          <h4 className="my-4 text-xl font-semibold text-black">Order Items</h4>

          {/* Cart Items (Now in Column) */}
          <div className="cart-item my-1 border-b-2 border-black">
            <div className="flex flex-col">  {/* This was changed to flex-col */}
              {cartItems.map((item) => (
                <Fragment key={item.product}>
                  <div className="row my-5">
                    <div className="mt-8">
                      <ul className="space-y-4">
                        <li className="flex items-center justify-between gap-4">
                          <img
                            src={item.image}
                            className="h-16 w-16 rounded object-cover"
                            alt={item.productName}
                          />
                          <div>
                            <div className="text-sm text-gray-900">
                              <Link to={`/product/${item.productId}`}>{item.productName}</Link>
                            </div>
                            <div className="mt-0.5 text-xs text-gray-600">
                              <p id="card_item_price">{item.unitName} {item.metricUnit}</p>
                              <p id="card_item_price">₱ {item.pricing}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-center justify-end gap-2">
                            <p className="text-black text-sm">
                              {item.quantity} x ₱ {item.pricing} = <b>₱ {(item.quantity * item.pricing).toFixed(2)}</b>
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="flex justify-end pt-8">
          <div className="w-full max-w-screen-lg">
            <dl className="space-y-2 text-sm text-gray-700">
              <div id="order_summary">
                <h4 className="text-lg font-semibold">Order Summary</h4>
                <div className="flex justify-between !text-base font-medium">
                  <dt>Total:</dt>
                  <dd>₱ {totalPrice.toFixed(2)}</dd>
                </div>
              </div>
            </dl>
            <div className="flex justify-end pt-6">
              <button
                className="block rounded bg-gray-700 px-5 py-3 text-sm text-white transition hover:bg-gray-600"
                onClick={confirmOrder}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Fragment>
  );
};
export default CheckoutAccordion;
