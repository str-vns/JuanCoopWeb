import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../layout/navbar";
import { useSelector, useDispatch } from "react-redux";
import { getPayment } from "@src/redux/Actions/orderActions";
import { addPaymentData } from '@redux/Actions/paymentActions';

const OnlineNext = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent_id");
  const payData = useSelector((state) => state.payData);
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!paymentIntentId) return;

      try {
        const response = await dispatch(getPayment(paymentIntentId));
        console.log("Response:", response);
        setPaymentData(response);

        if (response === "failed") {
          navigate(`/${payData?.type}`);
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchData();
  }, [paymentIntentId, dispatch, navigate, payData?.type]);

  const handlePayment = () => {
    if (!payData) {
      console.error("Payment data is missing.");
      return;
    }

    const paymentDetails = {
      name: payData.name,
      email: payData.email,
      phone: payData.phone,
      amount: payData.amount,
      type: payData.type,
      payStatus: "Paid",
      paymentIntentId: paymentIntentId,
    };

    console.log("Payment Data:", paymentDetails);
     dispatch(addPaymentData(paymentDetails));
     navigate("/checkout"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <Navbar />
      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Payment {paymentData === "paid" ? "Successful" : "Failed"}!
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Your online payment has been {paymentData === "paid" ? "successfully completed." : "unsuccessful."}
        </p>
        
        {paymentData === "paid" ? (
          <button
            onClick={handlePayment} 
            className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all"
          >
            Next: Confirm Payment
          </button>
        ) : (
          <p className="text-gray-600 text-center mt-2">
            Redirecting to the payment page...
          </p>
        )}
      </div>
    </div>
  );
};

export default OnlineNext;
