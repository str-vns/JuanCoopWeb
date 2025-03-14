import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSuccessTransactions } from "@redux/Actions/transactionActions";
import "@assets/css/withdrawAdmin.css"; //
import Sidebar from "../sidebar";

const WithdrawsSuccessAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Success");
  const [token, setToken] = useState(null);

  const { withdrawloading, withdraw = [], withdrawerror } = useSelector(
    (state) => state.transaction || {}
  );

  useEffect(() => {
    const fetchJwt = async () => {
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
      dispatch(getSuccessTransactions(token));
    }
  }, [token, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(getSuccessTransactions(token));
    } catch (err) {
      console.error("Error refreshing transactions:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

  return (
    <div className="withdrawPageContainer">
    <Sidebar />
    <div className="withdrawHeader">
    
    <h1 className="adminWithdrawTitle">Withdraw Request Lists</h1>
    </div>
  
    <div className="withdrawTabContainer">
      <button
        className={`withdrawTabButton ${
          selectedTab === "Pending" ? "withdrawActiveTab" : ""
        }`}
        onClick={() => navigate("/withdrawlistAdmin")}
      >
        Pending
      </button>
      <button
        className={`withdrawTabButton ${
          selectedTab === "Success" ? "withdrawActiveTab" : ""
        }`}
        onClick={() => setSelectedTab("Success")}
      >
        Success
      </button>
    </div>
  
    {withdrawloading ? (
      <div className="withdrawLoader">Loading...</div>
    ) : withdrawerror || withdraw.length === 0 ? (
      <div className="withdrawEmptyContainer">
        <p className="withdrawEmptyText">No Withdraw Requests found.</p>
      </div>
    ) : (
      <div className="withdrawListContainer">
        {withdraw.map((item) => (
          <div key={item._id} className="withdrawUserItem">
            <div className="withdrawUserDetails">
              <p className="withdrawUserID">{item._id}</p>
              <p className="withdrawUserStatus">
                Status:{" "}
                <span
                  style={{
                    color:
                      item.transactionStatus === "SUCCESS"
                        ? "green"
                        : item.transactionStatus === "PENDING"
                        ? "orange"
                        : item.transactionStatus === "FAILED"
                        ? "red"
                        : "black",
                  }}
                >
                  {item.transactionStatus}
                </span>
              </p>
              <p className="withdrawUserAmount">Amount: ₱ {item.amount}</p>
            </div>
            <button
              className="withdrawViewButton"
              onClick={() =>
                navigate(`/withdraws/${item._id}`, { state: { withdrawData: item } })
              }
            >
              View
            </button>
          </div>
        ))}
      </div>
    )}
  
    {/* <button className="withdrawRefreshButton" onClick={onRefresh} disabled={refreshing}>
      {refreshing ? "Refreshing..." : "Refresh"}
    </button> */}
  </div>
  
  );
};

export default WithdrawsSuccessAdmin;
