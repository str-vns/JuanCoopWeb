import { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "@redux/Actions/walletActions";
import { singleTransaction } from "@redux/Actions/transactionActions";
import { useNavigate } from "react-router-dom";
import { getToken, getCurrentUser } from "@utils/helpers";
import axios from "axios";
import { IoMenuOutline } from "react-icons/io5";
import "@assets/css/withdrawlist.css";
import Sidebar from "../sidebar";

const WithdrawList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
//   const context = useContext(AuthGlobal);
//   const userId = context?.stateUser?.userProfile?._id;
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;

  const { wallet } = useSelector((state) => state.getWallet);
  const { withdraw } = useSelector((state) => state.transaction);

  const [token, setToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
    if (userId && token) {
      dispatch(getWallet(userId, token));
      dispatch(singleTransaction(userId, token));
    }
  }, [userId, token, dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getWallet(userId, token)).finally(() => setRefreshing(false));
    dispatch(singleTransaction(userId, token)).finally(() => setRefreshing(false));
  };

  const withdrawHandler = () => {
    navigate("/paymentwithdraw");
  };

  return (
    <div className="coop-wallet-list min-h-screen bg-gray-50">
      <Sidebar />
      <div className="coop-wallet-list__header">
        <h1>Wallet</h1>
      </div>

      {/* Wallet Balance Section */}
      <div className="coop-wallet-list__content">
        <div className="coop-wallet-list__balance">
          <p>Balance: ₱{wallet?.balance ?? 0}</p>
        </div>

        <button onClick={withdrawHandler} className="coop-wallet-list__withdraw-btn">
          Withdraw
        </button>

        {/* Transaction List */}
        {withdraw && withdraw.length > 0 ? (
          <ul className="coop-wallet-list__transactions">
            {withdraw.map((item) => (
              <li key={item._id} className="coop-wallet-list__transaction">
                <div>
                  <p className="coop-wallet-list__amount">Amount: ₱{item.amount}</p>
                  <p className="coop-wallet-list__date">Date: {new Date(item.date).toLocaleDateString()}</p>
                </div>
                <p className={`coop-wallet-list__status coop-wallet-list__status--${item.transactionStatus.toLowerCase()}`}>
                  {item.transactionStatus}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="coop-wallet-list__no-transactions">No transactions available</p>
        )}
      </div>
    </div>
  );
};

export default WithdrawList;