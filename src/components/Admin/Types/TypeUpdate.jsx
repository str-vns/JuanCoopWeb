import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { typeUpdate } from "@redux/Actions/typeActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useLocation, useNavigate } from "react-router-dom";

const TypeUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const singleType = location.state?.types; // Receive the type to update
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);

  const [typeName, setTypeName] = useState(singleType?.typeName || "");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState("");
  const typeId = singleType?._id;

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

  const handleUpdateType = async () => {
    if (!typeName) {
      setErrors("Type name is required.");
      return;
    }

    const typeItem = {
      typeName,
    };

    try {
      await dispatch(typeUpdate(typeId, typeItem, token));
      setErrors("");
      alert("Type updated successfully!");
      navigate("/type-list");
    } catch (error) {
      console.error("Error updating type:", error);
      setErrors("Failed to update type. Please try again.");
    }
  };

  const backButton = () => {
    navigate("/type-list");
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={backButton}>
        Back
      </button>

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
    backgroundColor: "#f9f9f9",
    padding: "16px",
    height: "100vh",
  },
  backButton: {
    position: "absolute",
    top: "16px",
    left: "16px",
    backgroundColor: "transparent",
    border: "none",
    color: "#333",
    fontSize: "24px",
    cursor: "pointer",
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
