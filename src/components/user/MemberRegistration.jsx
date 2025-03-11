import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { allCoops } from "@redux/Actions/coopActions";
import { createMember,memberDetails } from "@redux/Actions/memberActions";
import { getToken, getCurrentUser } from "@utils/helpers";

import Navbar from "../layout/navbar";
import "@assets/css/memberRegistration.css";

function MemberRegistration() {
  const { coops } = useSelector((state) => state.allofCoops);
  const { loading: memberLoading, members, error } = useSelector((state) => state.memberList);
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const token = getToken(); // Directly get token
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [coopId, setCoopId] = useState("");
  const [barangayClearance, setBarangayClearance] = useState(null);
  const [validId, setValidId] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(allCoops());
    dispatch(memberDetails(userId, token));
  }, [dispatch]);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file); // Directly store the file object
    }
  };

  const memberRegistration = async () => {
    if (!address || !barangay || !city || !coopId || !barangayClearance || !validId) {
      setErrors("Please fill up all fields.");
      return;
    }

    const memberData = {
      address,
      barangay,
      city,
      coopId,
      barangayClearance,
      validId,
      userId,
    };

    setLoading(true);
    try {
      await dispatch(createMember(memberData));
      alert("Member Registration Successful! We will notify you once approved.");
      navigate("/home");
    } catch (error) {
      setErrors("Failed to register member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="member-registration-container">
      <Navbar />
      <h2>Member Registration</h2>
      {errors && <p className="member-registration-error">{errors}</p>}

      <label>Address:</label>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="member-registration-input" />

      <label>Barangay:</label>
      <input type="text" value={barangay} onChange={(e) => setBarangay(e.target.value)} className="member-registration-input" />

      <label>City:</label>
      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="member-registration-input" />

      <label>Choose Cooperative:</label>
      {/* <select value={coopId} onChange={(e) => setCoopId(e.target.value)} className="member-registration-select">
        <option value="">Select Cooperative</option>
        {coops.map((coop) => (
          <option key={coop._id} value={coop._id}>{coop.farmName}</option>
        ))}
      </select> */}

<select
  value={coopId}
  onChange={(e) => setCoopId(e.target.value)}
  className="member-registration-select"
>
  <option value="" disabled>Select Cooperative</option>
  {coops && coops.length > 0 ? (
    coops
      .filter(coop => !members.some(member => member.coopId?._id === coop._id))
      .map((coop) => (
        <option key={coop._id} value={coop._id}>
          {coop.farmName || "None"}
        </option>
      ))
  ) : (
    <option value="" disabled>No Cooperative</option>
  )}
</select>

      <label>Barangay Clearance:</label>
      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBarangayClearance)} className="member-registration-file" />
      {barangayClearance && <img src={URL.createObjectURL(barangayClearance)} alt="Barangay Clearance" className="member-registration-preview" />}

      <label>Valid ID:</label>
      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setValidId)} className="member-registration-file" />
      {validId && <img src={URL.createObjectURL(validId)} alt="Valid ID" className="member-registration-preview" />}

      <button onClick={memberRegistration} disabled={loading} className="member-registration-button">
        {loading ? "Submitting..." : "Apply"}
      </button>
    </div>
  );
}

export default MemberRegistration;