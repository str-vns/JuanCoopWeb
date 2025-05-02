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
      <div className="checkout-container min-h-screen bg-gray-100 overflow-y-auto">
        <div className="flex flex-col lg:flex-row items-start p-6 gap-8 max-w-screen-lg mx-auto">
          {/* Left Column: Order Items and Order Summary */}
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6">
            <h4 className="text-2xl font-semibold text-gray-800 border-b pb-4">
              Order Items
            </h4>

            {/* Scrollable section */}
            <div className="cart-item my-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="flex items-center justify-between border-b py-4"
                >
                  <img
                    src={item.image}
                    className="h-16 w-16 rounded object-cover"
                    alt={item.productName}
                  />
                  <div className="flex-1 ml-4">
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-lg font-medium text-gray-800 hover:underline"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {item.unitName} {item.metricUnit}
                    </p>
                    <p className="text-sm text-gray-600">₱ {item.pricing}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-medium">
                      {item.quantity} x ₱ {item.pricing} ={" "}
                      <span className="font-bold">
                        ₱ {(item.quantity * item.pricing).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6">
              <h4 className="text-xl font-semibold text-gray-800 border-b pb-4">
                Order Summary
              </h4>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Subtotal:</span>
                  <span>₱ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Shipping Fee:</span>
                  <span>₱ {calculateShipping().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Tax (12%):</span>
                  <span>₱ {(subtax() * calculateTax()).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-800 font-bold border-t pt-4">
                  <span>Grand Total:</span>
                  <span>₱ {calculateFinalTotal()}</span>
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-500 transition"
                  onClick={confirmOrder}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Shipping Info */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6">
            <h4 className="text-2xl font-semibold text-gray-800 border-b pb-4 text-center">
              Shipping Info
            </h4>
            {user && (
              <div className="mt-4 space-y-4">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {user.firstName}{" "}
                  {user.lastName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span>{" "}
                  {`${shipItems?.address}, ${shipItems?.city}, ${shipItems?.postalCode}`}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Payment Method:</span>{" "}
                  {payItems.paymentMethod}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CheckoutAccordion;
