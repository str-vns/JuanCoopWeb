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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAddresses(user._id));
    }
  }, [dispatch, user?._id]);

  const handleDeleteClick = (addressId) => {
    setAddressToDelete(addressId);
    setIsDeleteModalVisible(true); // Show the delete confirmation modal
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      dispatch(deleteAddress(addressToDelete));
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
    setIsDeleteModalVisible(false); // Hide the modal
    setAddressToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false); // Hide the modal
    setAddressToDelete(null);
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
            <div className="address-list-header">
            <h1>Address</h1>
            <button
              className="btn-add-address"
              onClick={() => navigate("/address/create")}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
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
                  <div className="addressdlt">
                    <button
                      onClick={() => handleDeleteClick(address._id)}
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
          <button onClick={handleAddressClick} className="proceed-button">
            Proceed To Payment
          </button>
        </div>
      </div>

      {isDeleteModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this address?</p>
            <div className="modal-buttons">
              <button className="modal-ok-btn" onClick={confirmDelete}>
                Yes
              </button>
              <button className="modal-cancel-btn" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;
