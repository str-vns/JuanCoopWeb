import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { typeUpdate } from "@redux/Actions/typeActions";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@components/Admin/sidebar";

const TypeUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const singleType = location.state?.type; 
  const dispatch = useDispatch();

  const [typeName, setTypeName] = useState(singleType?.typeName || "");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState("");
  const typeId = singleType?._id || null;

  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("Single type object:", singleType);
    console.log("Extracted typeId:", typeId);
  }, [location, singleType, typeId]);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = localStorage.getItem("jwt");
        if (res) {
          setToken(res);
        } else {
          console.error("No token found");
        }
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, []);

  const handleUpdateType = async () => {
    if (!typeName) {
      setErrors("Type name is required.");
      return;
    }

    const typeItem = {
      typeName,
    };

    try {
      if (token && typeId) {
        await dispatch(typeUpdate(typeId, typeItem, token));
        setErrors(""); // Clear previous errors
        alert("Type updated successfully!");
        navigate("/typelist"); // Redirect to type list
      } else {
        setErrors("Invalid token or type.");
        console.log("Invalid token or typeId:", token, typeId);
      }
    } catch (error) {
      console.error("Error updating type:", error);
      setErrors("Failed to update type. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <h1 style={styles.title}>Update Type</h1>

      <div style={styles.scrollView}>
        {/* Type Name Input */}
        <input
          type="text"
          placeholder="Type Name"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          style={styles.input}
        />

        {/* Error Message */}
        {errors && <p style={styles.errorText}>{errors}</p>}

        {/* Update Button */}
        <button style={styles.button} onClick={handleUpdateType}>
          Update Type
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "16px",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
    paddingLeft: "100px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
    textAlign: "center",
    marginTop: "32px",
  },
  scrollView: {
    overflowY: "auto",
    height: "calc(100% - 64px)",
  },
  input: {
    backgroundColor: "#fff",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
    boxShadow: "0px 2px 2px rgba(0,0,0,0.1)",
  },
  button: {
    backgroundColor: "#FEC120",
    padding: "12px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginTop: "16px",
    textAlign: "center",
  },
};

export default TypeUpdate;
