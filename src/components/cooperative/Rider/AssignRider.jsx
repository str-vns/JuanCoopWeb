import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { approveDriverOnly } from "@redux/Actions/driverActions";
import { createDelivery } from "@redux/Actions/deliveryActions";
import { getCurrentUser} from "@utils/helpers";
import "@assets/css/assignrider.css"; // Importing updated CSS module
import Sidebar from "../sidebar";

const AssignRider = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;

  const { driloading, drivers, drierror } = useSelector(
    (state) => state.onlyApprovedDriver
  );
  const { Deliveryloading, success, Deliveryerror } = useSelector(
    (state) => state.deliveryApi
  );

  const AssingInfo = location.state?.order || {};
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState(null);

  const orderItems = AssingInfo?.orderItems?.map((item) => ({
    product: item?.product,
    inventoryProduct: item?.inventoryProduct,
    quantity: item?.quantity,
  }));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jwtToken = localStorage.getItem("jwt");
        if (jwtToken) {
          setToken(jwtToken);
          if (userId) {
            dispatch(approveDriverOnly(userId, jwtToken));
          } else {
            setErrors("User ID is missing.");
          }
        } else {
          setErrors("No JWT token found.");
        }
      } catch (error) {
        console.error("Error retrieving JWT:", error);
        setErrors("Failed to retrieve JWT token.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, dispatch]);

  const getPaymentMethodDisplay = (method) => {
    return method === "COD" ? "Cash on Delivery" : method;
  };

  const assignDriver = async () => {
    const data = {
      orderId: AssingInfo?._id,
      coopId: userId,
      totalAmount: AssingInfo?.totalAmount,
    };

    const response = await dispatch(createDelivery(data, token));

    if (response?.success === true) {
      navigate("/assignlist");
    } else {
      alert("There is no courier available at the moment.");
    }
  };

  return (
    <div className="assign-rider-detailsContainer">
      <Sidebar />
      <div className="assign-rider-header">
        <h2 className="assign-rider-headerTitle">Delivery Details</h2>
      </div>

      <div className="assign-rider-container">
        <div className="assign-rider-customerInfo">
          <p>
            <strong>Name:</strong> {AssingInfo?.user?.firstName}{" "}
            {AssingInfo?.user?.lastName}
          </p>
          <p>
            <strong>Address:</strong> {AssingInfo?.shippingAddress?.address},{" "}
            {AssingInfo?.shippingAddress?.barangay},{" "}
            {AssingInfo?.shippingAddress?.city}
          </p>
          <p>
            <strong>Phone Number:</strong> {AssingInfo?.user?.phoneNum}
          </p>
          <p>
            <strong>Order:</strong> Order # {AssingInfo?._id}
          </p>
        </div>

        <div className="assign-rider-productDetails">
          <h3>Product Detail</h3>
          {orderItems?.map((item, index) => (
            <div className="assign-rider-productItem" key={index}>
              <img
                src={
                  item?.product?.image[0]?.url ||
                  "https://i.pinimg.com/originals/2e/cc/88/2ecc88184aa4234a9625c5197b4ef15b.jpg"
                }
                alt="Product"
                className="assign-rider-productImage"
              />
              <p>
                {item?.product?.productName || "Unknown Product"}{" "}
                {item?.inventoryProduct?.unitName}{" "}
                {item?.inventoryProduct?.metricUnit} - {item?.quantity || "0"}{" "}
                Qty
              </p>
            </div>
          ))}
        </div>

        <div className="assign-rider-paymentDetails">
          <p>
            <strong>Mode of Payment:</strong>{" "}
            {getPaymentMethodDisplay(AssingInfo?.paymentMethod)}
          </p>
          <p>
            <strong>To Pay:</strong> ₱ {AssingInfo?.totalAmount}
          </p>
        </div>

        {errors && <p className="assign-rider-errorText">{errors}</p>}

        {driloading ? (
          <p>Loading...</p>
        ) : (
          <button
            className="assign-rider-deliverButton"
            onClick={assignDriver}
            disabled={Deliveryloading}
          >
            Assign now
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignRider;
