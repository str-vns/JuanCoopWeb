import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPendingRefund } from "@redux/Actions/transactionActions";
import { FaSpinner } from "react-icons/fa";
import "@assets/css/refundAdmin.css"; 

import Sidebar from "../sidebar";

const RefundProcessAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [token, setToken] = useState(null);

  const { refundloading, refund = [], refunderror } = useSelector((state) => state.refund);

  // Get JWT token from local storage
  useEffect(() => {
    const fetchJwt = () => {
      try {
        const res = localStorage.getItem("jwt");
        if (res) {
          setToken(res);
        } else {
          console.warn("No JWT token found in localStorage.");
        }
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, []);

  // Fetch refunds when token is available
  useEffect(() => {
    if (token) {
      console.log("Fetching refund data...");
      dispatch(getPendingRefund(token));
    }
  }, [token, dispatch]);

  // Refresh refund data
  const onRefresh = async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      await dispatch(getPendingRefund(token));
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="processContainer">
      <Sidebar />

      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <h2 className="refundTitle">Refund Request List</h2>
      </div>

      {/* Tabs */}
      <div className="processTabContainer">
        <button
          className={`processTabButton ${selectedTab === "Pending" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setSelectedTab("Pending")}
        >
          Pending
        </button>
        <button
          className={`processTabButton ${selectedTab === "Success" ? "border-b-2 border-green-500 font-bold" : ""}`}
          onClick={() => navigate("/RefundSuccessAdmin")}
        >
          Success
        </button>
      </div>

      {/* Content */}
      {refundloading ? (
        <div className="processLoader">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      ) : refund.length === 0 || refunderror ? (
        <div className="processEmptyState">No refund requests found.</div>
      ) : (
        <ul className="processListContainer">
          {refund.map((item) => (
            <li key={item._id} className="processCard">
              <div className="processDetails">
                <p className="refundId">{item?.user?.firstName} {item?.user?.lastName}</p>
              <p className="refundAmount">Request By: {item?.accountName}</p>
                <p className="processStatus">
                  Status:{" "}
                  <span
                    className={`processStatusText ${
                      item.transactionStatus === "SUCCESS"
                        ? "text-green-500"
                        : item.transactionStatus === "PENDING"
                        ? "text-orange-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.transactionStatus}
                  </span>
                </p>
                <p className="processAmount">Amount: ₱{item.amount ? item.amount.toFixed(2) : "0.00"}</p>
              </div>
              <button
              
                onClick={
                  () => navigate(`/refund-details/${item._id}`, { state: { refundData: item } })}
                className="processViewButton"
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RefundProcessAdmin;
