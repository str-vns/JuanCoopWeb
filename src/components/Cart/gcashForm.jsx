import React, { useEffect, useState } from "react";
import "@assets/css/gcash.css";
import Navbar from "../layout/navbar";
import { addPaymentData } from '@redux/Actions/paymentActions';
import { onlinePayment, getPayment } from "@src/redux/Actions/orderActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { memberDetails } from "@redux/Actions/memberActions";
import { useFormik } from "formik";
import * as Yup from "yup";

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
  console.log("members",members)
  const approvedMember = members?.find((member) => member.approvedAt !== null);
  const coopId = approvedMember?.coopId?._id;

   useEffect(() => {
    if (!members) {
      dispatch(memberDetails( userId, token));
    } 
   })

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
  
      if (coopId !== item.coop) {
          taxableTotal += itemTotal;  
      } else {
          nonTaxableTotal += itemTotal;  
      }
  });

    const taxAmount = taxableTotal * 0.12; 
    const finalTotal = taxableTotal + nonTaxableTotal + taxAmount + shippingCost;

    return finalTotal.toFixed(2);
  };

  const handleSubmit = async (values) => {

    const paymentData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        amount: values.amount,
        type: payItems.paymentMethod,
        isMobile: false,
    }
    const paymentResult = await dispatch(onlinePayment(paymentData, token));
    console.log("payData", paymentResult)
    alert("Gcash payment details submitted successfully!");
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format")
    .required("Email is required"),
    phone: Yup.string().matches(/^09\d{9}$/, "Phone number must start with '09' and be 11 digits long")
    .required("Phone number is required"),
    amount: Yup.number().required("Amount is required"),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "09",
      amount: calculateFinalTotal(),
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        handleSubmit(values);
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  })
  return (
    <div className="gcashfinal">
      <div className="gcash-form-container">
        <Navbar />
        <h2 className="gcash-form-title">Gcash Payment Form</h2>
        <form onSubmit={formik.handleSubmit} className="gcash-form">
          {/* Name */}
          <label className="gcash-label">
            Full Name:{" "}
            {formik.touched.name && formik.errors.name && (
              <span className="text-red-500 text-sm ml-3">{formik.errors.name}</span>
            )}
          </label>
          <input
            type="text"
            name="name"
            className="gcash-input"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {/* Email */}
          <label className="gcash-label">
            Email Address:{" "}
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-500 text-sm ml-3">{formik.errors.email}</span>
            )}
          </label>
          <input
            type="email"
            name="email"
            className="gcash-input"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {/* Phone */}
          <label className="gcash-label">
            Phone Number (Gcash):{" "}
            {formik.touched.phone && formik.errors.phone && (
              <span className="text-red-500 text-sm ml-3">{formik.errors.phone}</span>
            )}
          </label>
          <input
            type="tel"
            name="phone"
            className="gcash-input"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {/* Amount */}
          <label className="gcash-label">
            Amount (₱):{" "}
            {formik.touched.amount && formik.errors.amount && (
              <span className="text-red-500 text-sm ml-3">{formik.errors.amount}</span>
            )}
          </label>
          <input
            type="number"
            name="amount"
            className="gcash-input"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
          />

          <button type="submit" className="gcash-submit-button">
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );

};

export default GcashForm;
