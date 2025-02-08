import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { allCoops } from "@redux/Actions/coopActions";
import { createMember } from "@redux/Actions/memberActions";
import Navbar from "../layout/navbar";
import AuthGlobal from "@redux/Store/AuthGlobal";
import "@assets/css/memberRegistration.css";

function MemberRegistration() {
  const { coops } = useSelector((state) => state.allofCoops);
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userId = context?.stateUser?.userProfile?._id;
  
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
  }, [dispatch]);

  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
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

    dispatch(createMember(memberData));
    alert("Member Registration Successful! We will notify you once approved.");
    navigate("/home");
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
      <select value={coopId} onChange={(e) => setCoopId(e.target.value)} className="member-registration-select">
        <option value="">Select Cooperative</option>
        {coops.map((coop) => (
          <option key={coop._id} value={coop._id}>{coop.farmName}</option>
        ))}
      </select>

      <label>Barangay Clearance:</label>
      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBarangayClearance)} className="member-registration-file" />
      {barangayClearance && <img src={barangayClearance} alt="Barangay Clearance" className="member-registration-preview" />}

      <label>Valid ID:</label>
      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setValidId)} className="member-registration-file" />
      {validId && <img src={validId} alt="Valid ID" className="member-registration-preview" />}

      <button onClick={memberRegistration} disabled={loading} className="member-registration-button">
        {loading ? "Submitting..." : "Apply"}
      </button>
    </div>
  );
}

export default MemberRegistration;
