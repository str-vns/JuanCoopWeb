import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSuccessRefund } from "@redux/Actions/transactionActions";
import { FaSpinner } from "react-icons/fa";
import Sidebar from "../sidebar";

const RefundSuccessAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Success");
  const [token, setToken] = useState(null);

  // Get refund data from Redux state
  const { refundloading, refund = [], refunderror } = useSelector((state) => state.refund || {});

  useEffect(() => {
    const fetchJwt = () => {
      try {
        const res = localStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getSuccessRefund(token));
    }
  }, [token, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (token) {
        dispatch(getSuccessRefund(token));
      }
    } catch (err) {
      console.error("Error refreshing refunds:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

  return (
    <div className="refundContainer">
    <Sidebar/>
    <div className="flex items-center justify-center mb-4">
  <h2 className="refundTitle">Refund Request List</h2>
</div>

    <div className="refundTabContainer">
      <button
        className={`refundTabButton ${selectedTab === "Pending" ? "refundActiveTab" : ""}`}
        onClick={() => navigate("/RefundProcessAdmin")}
      >
        Pending
      </button>
      <button
        className={`refundTabButton ${selectedTab === "Success" ? "refundActiveTab" : ""}`}
        onClick={() => setSelectedTab("Success")}
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
      <div className="refundEmptyContainer">
        <span className="refundEmptyText">No Request Withdraw found.</span>
      </div>
    ) : (
      <div className="refundListContainer">
        {refund.map((item) => (
          <div key={item?._id} className="refundCard">
            <div className="refundDetails">
              <p className="refundId">{item?._id}</p>
              <p className="refundStatus">Status: <span className={item?.transactionStatus === "SUCCESS" ? "status-success" : "status-pending"}>
                {item?.transactionStatus}
              </span></p>
              <p className="refundAmount">Amount: ₱{item?.amount ? item.amount.toFixed(2) : "0.00"}</p>
            </div>
            <button 
              className="refundViewButton"
              onClick={() => navigate(`/refund-details/:id`, { state: { refundData: item } })}
            >
              View
            </button>
          </div>
        ))}
      </div>
    )}
  
  </div>
  );
};

export default RefundSuccessAdmin;