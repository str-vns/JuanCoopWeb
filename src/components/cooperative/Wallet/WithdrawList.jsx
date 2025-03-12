import { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "@redux/Actions/walletActions";
import { singleTransaction } from "@redux/Actions/transactionActions";
import { useNavigate } from "react-router-dom";
import { getToken, getCurrentUser } from "@utils/helpers";
import axios from "axios";
import { IoMenuOutline } from "react-icons/io5";
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
    <div className="min-h-screen bg-gray-100">
      <Sidebar/>
      <div className="flex items-center p-4 bg-white shadow-md border-b">
        <h1 className="flex-grow text-center text-xl font-bold">Wallet</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
        <div className="bg-purple-600 text-white p-4 rounded-md text-center">
          <p className="text-lg font-bold">Balance: ₱{wallet?.balance ?? 0}</p>
        </div>

        <button
          onClick={withdrawHandler}
          className="mt-4 w-full bg-orange-500 text-white p-3 rounded-md font-bold hover:bg-orange-600 transition"
        >
          Withdraw
        </button>

        {/* Transaction List */}
        {withdraw && withdraw.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {withdraw.map((item) => (
              <li
                key={item._id}
                className="bg-white p-4 rounded-lg shadow flex justify-between"
              >
                <div>
                  <p className="text-gray-700 font-medium">Amount: ₱{item.amount}</p>
                  <p className="text-gray-600 text-sm">Date: {new Date(item.date).toLocaleDateString()}</p>
                </div>
                <p
                  className={`font-bold ${
                    item.transactionStatus === "SUCCESS"
                      ? "text-green-600"
                      : item.transactionStatus === "PENDING"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {item.transactionStatus}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-4">No transactions available</p>
        )}
      </div>
    </div>
  );
};

export default WithdrawList;