import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@assets/css/address.css";
import Navbar from "../layout/navbar";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@utils/helpers";
import { fetchAddresses, deleteAddress } from "@redux/Actions/addressActions";
import { addShip } from "@redux/Actions/shippingActions";
import { toast } from "react-toastify";

const unSuccess = "Unsuccessful_01";
const success = "Successful_02";

const Address = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const addresses = useSelector((state) => state.addresses.data);
  const loading = useSelector((state) => state.addresses.loading);
  const error = useSelector((state) => state.addresses.error);
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAddresses(user._id));
    }
  }, [dispatch, user?._id]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (confirmDelete) {
      dispatch(deleteAddress(id));
      toast.success("Address deleted successfully.", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: success,
        closeButton: false,
      });
    }
  };

  const handleAddressClick = (e) => {
    e.preventDefault();
    if (selectedLocationId) {
      dispatch(addShip(selectedLocationId));
      navigate("/payment");
    } else {
      toast.error("Please select a shipping address to proceed.", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: unSuccess,
        closeButton: false,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="address-section">
        {loading ? (
          <p className="loadingText">Loading...</p>
        ) : error ? (
          <p className="errorText">
            Error: {error.message || "Something went wrong."}
          </p>
        ) : (
          <div className="address-container">
            {Array.isArray(addresses) && addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  className={`address-box ${
                    selectedLocationId?._id === address._id ? "selected" : ""
                  }`}
                  key={address._id}
                  onClick={() => setSelectedLocationId(address)}
                >
                  <div className="address-details">
                    <p>
                      <strong>{address.address || "Unnamed Location"}</strong>
                    </p>
                    <p>
                      {address.barangay || "Barangay not specified"},{" "}
                      {address.city || "City not specified"},{" "}
                      {address.postalCode || "Postal Code not specified"}
                    </p>
                  </div>
                  <div className="address-actions">
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="delete-button"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="noAddressText">
                No addresses available. Add one to continue.
              </p>
            )}
          </div>
        )}
        <div className="button-container">
          <button
            onClick={() => navigate("/address/create")}
            className="proceed-button"
          >
            Add Address
          </button>
          <button onClick={handleAddressClick} className="proceed-button">
            Proceed To Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Address;
