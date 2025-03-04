import React, { useEffect, useState, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { singleDriver, removeDriver } from "@redux/Actions/driverActions";
// import AuthGlobal from "../redux/store/AuthGlobal";
import { Button, CircularProgress, Card, CardContent, Typography, IconButton, AppBar, Toolbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../sidebar";
import { getToken, getCurrentUser } from "@utils/helpers";

const RiderList = () => {
//   const context = useContext(AuthGlobal);
//   const userId = context?.stateUser?.userProfile?._id;
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, drivers, error } = useSelector((state) => state.driverList);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("Rider");

  useEffect(() => {
    const fetchJwt = async () => {
      const jwtToken = localStorage.getItem("jwt");
      setToken(jwtToken);
    };
    fetchJwt();
  }, []);

  useEffect(() => {
    if (token) dispatch(singleDriver(userId, token));
  }, [dispatch, token, userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(singleDriver(userId, token));
    setTimeout(() => setRefreshing(false), 1000);
  }, [dispatch, token]);

  const handleDelete = (driverId) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      dispatch(removeDriver(driverId, token));
      onRefresh();
    }
  };

  const handleRiderDelivery = (driver) => {
    navigate(`/assigndelivery/${driver._id}`, { state: { driver } }); 
  };

  const handleRiderDetails = (driver) => {
    navigate(`/riderdetails/${driver._id}`, { state: { driver } }); 
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <Sidebar/>
      <header style={{ backgroundColor: "#FCF300", color: "black", fontWeight: "bold", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>Rider List</h1>
        <nav>
          <button 
            style={{ backgroundColor: "#FFD700", color: "black", fontWeight: "bold", padding: "8px 15px", border: "none", cursor: "pointer" }}
            onClick={() => navigate("/riderregister")}
          >
            Add Rider
          </button>
        </nav>
      </header>


      {/* Tab Navigation */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "15px", 
        padding: "15px", 
        backgroundColor: "#F8F9FA", // Light gray background for better contrast
        borderRadius: "10px", 
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <Button 
          variant="contained"
          sx={{
            backgroundColor: activeTab === "Assign" ? "#FFD500" : "white",
            color: activeTab === "Assign" ? "black" : "#333",
            fontWeight: "bold",
            padding: "10px 20px",
            border: activeTab === "Assign" ? "none" : "2px solid #FFD500",
            "&:hover": {
              backgroundColor: activeTab === "Assign" ? "#FFC300" : "#FFD500",
              color: "black"
            }
          }}
          onClick={() => navigate("/assignlist")}
        >
          Assign
        </Button>
        
        <Button 
          variant="contained"
          sx={{
            backgroundColor: activeTab === "Rider" ? "#FFD500" : "white",
            color: activeTab === "Rider" ? "black" : "#333",
            fontWeight: "bold",
            padding: "10px 20px",
            border: activeTab === "Rider" ? "none" : "2px solid #FFD500",
            "&:hover": {
              backgroundColor: activeTab === "Rider" ? "#FFC300" : "#FFD500",
              color: "black"
            }
          }}
          onClick={() => setActiveTab("Rider")}
        >
          Rider
        </Button>
      </div>


      {/* Content */}
      {loading ? (
        <CircularProgress />
      ) : error || drivers?.length === 0 ? (
        <Typography variant="h6" color="error" align="center">No Drivers Found.</Typography>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {drivers.map((driver) => (
            <Card key={driver._id} style={{ width: "300px", padding: "10px" }}>
              <CardContent>
                <img
                  src={driver.image?.url || "https://via.placeholder.com/100"}
                  alt="Profile"
                  style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                />
                <Typography variant="h6">{driver.firstName} {driver.lastName}</Typography>
                <Typography>Approved: {driver.approvedAt ? "✅ Approved" : "❌ Not Approved"}</Typography>
                <Typography>Available: {driver.isAvailable ? "✅ Available" : "❌ Unavailable"}</Typography>
                {driver.approvedAt && (
                  <div style={{ marginTop: "10px" }}>
                    <Button variant="contained" color="primary" onClick={() => handleRiderDelivery(driver)}>Assign</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleRiderDetails(driver)}>View</Button>
                  </div>
                )}
                <IconButton color="error" onClick={() => handleDelete(driver._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiderList;