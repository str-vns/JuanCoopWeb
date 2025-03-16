import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SingleCancelled } from "@redux/Actions/cancelledActions";
import Sidebar from "../cooperative/sidebar";

const ReasonCancelled = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const orderItemId = location.state?.order?._id;
  const orderItems = location.state?.order;
  
  console.log("orderItemId", orderItemId);
  console.log("orderItems", orderItems);
  
  const { loading, response, error } = useSelector((state) => state.cancelled);
  const [token, setToken] = useState(null);

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
      dispatch(SingleCancelled(orderItemId, token));
    }
  }, [orderItemId, token, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 ml-[250px]">
        <Sidebar />
      <div className="flex items-center bg-white p-4 shadow-md rounded-lg">
        <h2 className="ml-4 text-lg font-bold">Reason of Cancel</h2>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 mt-6 rounded-lg shadow-md">
        <img
          src={
            response?.cancelledBy?.image?.url || "/assets/img/buyer.png"
          }
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto"
        />
        <p className="text-center mt-2 font-medium">
          Cancelled by:{" "}
          <span className="font-bold">
            {response?.cancelledBy?.firstName} {response?.cancelledBy?.lastName}
          </span>
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
          <div className="flex items-center gap-4 border p-4 rounded-lg shadow-sm">
            <img
              src={orderItems?.product?.image?.[0]?.url || orderItems?.image}
              alt="Product"
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <p className="font-semibold">{orderItems?.product?.productName}</p>
              <p className="text-sm text-gray-600">
              Price: ₱ {(orderItems?.price || 0) * (orderItems?.quantity || 0)}
              </p>
              <p className="text-sm text-gray-600">Quantity: {orderItems?.quantity}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Reason for Cancellation:</h3>
          <p className="text-gray-700 mt-2">{response?.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ReasonCancelled;