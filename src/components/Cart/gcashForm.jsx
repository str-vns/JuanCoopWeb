import React, { useEffect, useState } from "react";
import "@assets/css/gcash.css";
import Navbar from "../layout/navbar";
import { addPaymentData } from '@redux/Actions/paymentActions';
import { onlinePayment, getPayment } from "@src/redux/Actions/orderActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { memberDetails } from "@redux/Actions/memberActions";

const GcashForm = () => {
 const cartItems = useSelector((state) => state.cartItems);
 const payItems = useSelector((state) => state.payItems);
  const token = getToken()
  const cUser = getCurrentUser()
  const dispatch = useDispatch()
  const userId = cUser._id
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const { loading, members, error }  = useSelector((state) => state.memberList); 
  const approvedMember = members?.find((member) => member.approvedAt !== null);
  const coopId = approvedMember?.coopId?._id;

  console.log("loc",coopId)
  useEffect(() => {
    const membering = async () => {
      try {
        dispatch(memberDetails(userId, token)); // ✅ Now this works
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };
    membering();
  }, [userId, dispatch]);

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

  const calculateFinalTotal = () => {
    const shippingCost = calculateShipping();

    let taxableTotal = 0;
    let nonTaxableTotal = 0;


    cartItems.forEach((item) => {
      console.log("Item: ", item);
      const itemTotal = item.pricing * item.quantity;
      console.log("Item Total: ", itemTotal);
  
      if (!coopId.includes(item?.coop)) {
          taxableTotal += itemTotal;  
      } else {
          nonTaxableTotal += itemTotal;  
      }
  });

    const taxAmount = taxableTotal * 0.12; 
    const finalTotal = taxableTotal + nonTaxableTotal + taxAmount + shippingCost;

    return finalTotal.toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payData = {
        name: name,
        email: email,
        phone: phone,
        amount: calculateFinalTotal(),
        
    }
    console.log(payData)
    // console.log("Form Submitted:", formData);
    alert("Gcash payment details submitted successfully!");
  };

  return (
    <div className="gcashfinal">

    <div className="gcash-form-container">
        <Navbar/>
      <h2 className="gcash-form-title">Gcash Payment Form</h2>
      <form onSubmit={handleSubmit} className="gcash-form">
        <label className="gcash-label">Full Name:</label>
        <input
          type="text"
          name="name"
          className="gcash-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="gcash-label">Email Address:</label>
        <input
          type="email"
          name="email"
          className="gcash-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="gcash-label">Phone Number (Gcash):</label>
        <input
          type="tel"
          name="phone"
          className="gcash-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label className="gcash-label">Amount (₱):</label>
        <input
          type="number"
          name="amount"
          className="gcash-input"
          value={calculateFinalTotal()}
          required
        />

        <button type="submit" className="gcash-submit-button">Submit Payment</button>
      </form>
    </div>
    </div>
  );
};

export default GcashForm;
