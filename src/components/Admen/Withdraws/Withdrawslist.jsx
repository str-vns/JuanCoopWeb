import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPendingTransactions } from "@redux/Actions/transactionActions";
import "@assets/css/withdrawAdmin.css"; // Regular CSS file
import Sidebar from "../sidebar";

const WithdrawsListAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [token, setToken] = useState(null);

  const {
    withdrawloading,
    withdraw = [],
    withdrawerror,
  } = useSelector((state) => state.transaction || {});

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
      dispatch(getPendingTransactions(token));
    }
  }, [token, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(getPendingTransactions(token));
    } catch (err) {
      console.error("Error refreshing transactions:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

  return (

   <div className="adminWithdrawContainer">
    <Sidebar/>
 
  <h1 className="adminWithdrawTitle">Withdraw Request Lists</h1>

  <div className="adminWithdrawTabContainer">
    <button
      className={`adminWithdrawTabButton ${selectedTab === "Pending" ? "adminActiveTab" : ""}`}
      onClick={() => setSelectedTab("Pending")}
    >
      Pending
    </button>
    <button
      className={`adminWithdrawTabButton ${selectedTab === "Success" ? "adminActiveTab" : ""}`}
      onClick={() => navigate("/withdrawSuccessAdmin")}
    >
      Success
    </button>
  </div>

  {withdrawloading ? (
    <div className="adminWithdrawLoader">Loading...</div>
  ) : withdrawerror || !withdraw.length ? (
    <div className="adminWithdrawEmptyContainer">
      <p className="adminWithdrawEmptyText">No Withdraw Requests found.</p>
    </div>
  ) : (
    <div className="adminWithdrawListContainer">
      {withdraw.map((item) => (
        <div key={item._id} className="adminWithdrawCard">
          <div className="adminWithdrawDetails">
            <p className="adminWithdrawId">{item._id}</p>
            <p className="adminWithdrawStatus">
              Status: <span className={`status-${item.transactionStatus.toLowerCase()}`}>{item.transactionStatus}</span>
            </p>
            <p className="adminWithdrawAmount">Amount: ₱ {item.amount}</p>
          </div>
          <button
            className="adminWithdrawViewButton"
            onClick={() => navigate(`/withdraws/${item._id}`, { state: { withdrawData: item } })}
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

export default WithdrawsListAdmin;
