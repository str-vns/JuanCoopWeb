import React, { Fragment, useState, useEffect } from "react";
import "@assets/css/checkout.css";
import Navbar from "../layout/navbar";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, isAuth, getToken } from "@utils/helpers";
import { memberDetails } from "@redux/Actions/memberActions";
import { toast } from "react-toastify";
import { createOrder } from "@redux/Actions/orderActions";
import { clearPayData } from '@redux/Actions/paymentActions';

const CheckoutAccordion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = getCurrentUser()?._id;
  const token = getToken();
  const payItems = useSelector((state) => state.payItems);
  const cartItems = useSelector((state) => state.cartItems);
  const shipItems = useSelector((state) => state.shipItems);
  const payData = useSelector((state) => state.payData);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.pricing * item.quantity,
    0
  );
  const { loading, members, error } = useSelector((state) => state.memberList);
  const approvedMember = members?.filter(
    (member) => member.approvedAt !== null
  );
  const coopId = approvedMember?.map((member) => member.coopId?._id) || [];

const shippingFee = 75; // Fixed shipping fee in PHP
const taxRate = 0.12; // 12% tax
const taxAmount = totalPrice * taxRate;
const grandTotal = totalPrice + taxAmount + shippingFee;

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

const payStatus = payData?.payStatus === "Paid" ? "Paid" : "Unpaid";
console.log("Pay Status:", payStatus);
  const confirmOrder = async () => {
    if (!payItems || !shipItems || !cartItems) {
      toast?.error("There is a problem with your cart", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: "unSuccess",
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
        toastId: "unSuccess",
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
        user: item.user,
        inventoryProduct: item?.inventoryId,
      })),

      shippingAddress: shipItems?._id,
      paymentMethod: payItems?.paymentMethod,
      payStatus: payStatus,
      totalPrice: calculateFinalTotal(), 
      shippingPrice: calculateShipping(), 
    };
    console.log("Order Data:", orderData);
    try {
      const orderCreationResult = await dispatch(createOrder(orderData, token));
      
      if (orderCreationResult?.order) {
        dispatch(clearPayData());
        toast?.success("Your order has been successfully placed!", {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: "success",
          closeButton: false,
        });
        navigate("/confirm");
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
          toastId: "unSuccess",
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
        toastId: "unSuccess",
        closeButton: false,
      });
    }
  };

  return (
    <Fragment>
      <Navbar />
      <div className="checkout-container min-h-screen bg-gray-100">
        <div className="flex flex-col lg:flex-row items-start p-4 gap-8 max-w-screen-lg mx-auto">
          {/* Left Column: Order Items and Order Summary */}
          <div className="w-full lg:w-2/3 space-y-4 bg-white rounded shadow-lg p-6">
            <h4 className="text-xl font-semibold text-black border-b pb-2">
              Order Items
            </h4>

            {/* Scrollable section */}
            <div className="cart-item my-1 border-b-2 border-black max-h-60 overflow-y-auto">
              <div className="flex flex-col">
                {cartItems.map((item) => (
                  <Fragment key={item.product}>
                    <div className="row my-5">
                      <div className="mt-1">
                        <ul className="space-y-4">
                          <li className="flex items-center justify-between gap-4">
                            <img
                              src={item.image}
                              className="h-16 w-16 rounded object-cover"
                              alt={item.productName}
                            />
                            <div>
                              <div className="text-sm text-gray-900 text-left">
                                <Link to={`/product/${item.productId}`}>
                                  {item.productName}
                                </Link>
                              </div>
                              <div className="mt-0.5 text-xs text-gray-600 text-left">
                                <p id="card_item_price">
                                  {item.unitName} {item.metricUnit}
                                </p>
                                <p id="card_item_price">₱ {item.pricing}</p>
                              </div>
                            </div>
                            <div className="flex flex-1 items-center justify-end gap-2">
                              <p className="text-black text-sm">
                                {item.quantity} x ₱ {item.pricing} ={" "}
                                <b>
                                  ₱ {(item.quantity * item.pricing).toFixed(2)}
                                </b>
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

            {/* Order Summary */}
            <div className="flex justify-end pt-8">
              <div className="w-full">
                <dl className="space-y-2 text-sm text-gray-700">
                <div id="order_summary">
  <h4 className="text-lg font-semibold">Order Summary</h4>
  <div className="flex justify-between !text-base font-medium">
    <span className="font-bold">Subtotal:</span> 
    <dd>₱ {totalPrice.toFixed(2)}</dd>
  </div>
  <div className="flex justify-between !text-base font-medium">
    <span className="font-bold">Shipping Fee:</span> 
    <dd>₱ {calculateShipping().toFixed(2)}</dd>
  </div>
  <div className="flex justify-between !text-base font-medium">
    <span className="font-bold">Tax (12%):</span> 
    <dd>₱ {(subtax() * calculateTax()).toFixed(2)}</dd>
  </div>
  <div className="flex justify-between !text-lg font-bold border-t pt-2">
    <span className="font-bold">Grand Total:</span> 
    <dd>₱ {calculateFinalTotal()}</dd>
  </div>
</div>

                </dl>
                <div className="flex justify-end pt-6">
                  <button
                    className="block rounded bg-blue-700 px-5 py-3 text-sm text-white transition hover:bg-blue-600"
                    onClick={confirmOrder}
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Shipping Info */}
          <div className="w-full lg:w-1/3 space-y-4 bg-white rounded shadow-lg p-6 text-left">
            <h4 className="text-xl font-semibold text-black border-b pb-2 text-center">
              Shipping Info
            </h4>
            {user && (
              <p className="text-black">
              <span className="font-bold">Name:</span> {user.firstName}, {user.lastName}
              </p>
            )}
            <p className="text-black">
            <span className="font-bold">Address:</span> {" "}
              {`${shipItems?.address}, ${shipItems?.city}, ${shipItems?.postalCode}`}
            </p>
            <p className="text-black">
            <span className="font-bold">Payment Method:</span> {payItems.paymentMethod}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CheckoutAccordion;
