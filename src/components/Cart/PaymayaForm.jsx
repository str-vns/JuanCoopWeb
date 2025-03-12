import React, { useEffect, useState } from "react";
import "@assets/css/paymaya.css";
import Navbar from "../layout/navbar";
import { addPaymentData } from '@redux/Actions/paymentActions';
import { onlinePayment } from "@src/redux/Actions/orderActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { memberDetails } from "@redux/Actions/memberActions";
import { useFormik } from "formik";
import * as Yup from "yup"

const PaymayaForm = () => {
   const cartItems = useSelector((state) => state.cartItems);
   const payItems = useSelector((state) => state.payItems);
    const token = getToken()
    const cUser = getCurrentUser()
    const dispatch = useDispatch()
    const userId = cUser._id
    const { loading, members, error }  = useSelector((state) => state.memberList); 
    const approvedMember = members?.find((member) => member.approvedAt !== null);
    const coopId = approvedMember?.coopId?._id;
    const [finalAmount, setFinalAmount] = useState(0);

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
       
         useEffect(() => {
         const calculateFinalTotal = () => {
           const shippingCost = calculateShipping();
           let taxableTotal = 0;
           let nonTaxableTotal = 0;
       
           cartItems.forEach((item) => {
             const itemTotal = item.pricing * item.quantity;
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
       
         setFinalAmount(calculateFinalTotal());
       }, [cartItems, coopId]); 
       
         
       
         const handleSubmit = async (values) => {
       
           const paymentData = {
               name: values.name,
               email: values.email,
               phone: values.phone,
               amount: values.amount,
               type: payItems.paymentMethod,
               isMobile: false,
           }
           try {
             const paymentResult = await dispatch(onlinePayment(paymentData, token));
       
             if (paymentResult?.attributes?.next_action?.redirect?.url) {
               alert("Gcash payment details submitted successfully!");
               dispatch(addPaymentData(paymentData));
               window.location.href = paymentResult.attributes.next_action.redirect.url; 
       
             } else {
               throw new Error("Payment processing failed, no redirect URL.");
             }
           } catch (error) {
             console.error("Payment creation error:", error);
             alert(error.message || "Failed to create payment.");
           }
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
           enableReinitialize: true,
           initialValues: {
             name: "",
             email: "",
             phone: "09",
             amount: finalAmount,
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
    <div className="paymaya-final"> {/* Corrected Class Name */}

      <Navbar />

      <div className="paymaya-form-container"> {/* Corrected Class Name */}
        <h2 className="paymaya-form-title">Paymaya Payment Form</h2>
        <form onSubmit={formik.handleSubmit} className="paymaya-form">
          <label className="paymaya-label">Full Name:{" "}
            {formik.touched.name && formik.errors.name && (
              <span className="text-red-500 text-sm ml-3">{formik.errors.name}</span>
            )} </label>
          <input
            type="text"
            name="name"
            className="paymaya-input"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <label className="paymaya-label"> Email Address:{" "}
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-500 text-sm ml-3">{formik.errors.email}</span>
            )}</label>
          <input
            type="email"
            name="email"
            className="paymaya-input"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <label className="paymaya-label">Phone Number (Paymaya):{" "}
            {formik.touched.phone && formik.errors.phone && (
              <span className="text-red-500 text-sm ml-3">{formik.errors.phone}</span>
            )}</label>
          <input
            type="tel"
            name="phone"
            className="paymaya-input"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <label className="paymaya-label">Amount (₱):{" "}
            {formik.touched.amount && formik.errors.amount && (
              <span className="text-red-500 text-sm ml-3">{formik.errors.amount}</span>
            )}</label>
          <input
            type="number"
            name="amount"
            className="paymaya-input"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
          />

          <button type="submit" className="paymaya-submit-button">
            Submit Payment
          </button>
        </form>
      </div>

    </div>
  );
};

export default PaymayaForm;
