import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { singleDriver, removeDriver } from "@redux/Actions/driverActions";
import {
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getCurrentUser } from "@utils/helpers";
import "@assets/css/RiderList.css";
import Sidebar from "../sidebar";

const RiderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;

  const { loading, drivers, error } = useSelector((state) => state.driverList);

  const [token, setToken] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [activeTab, setActiveTab] = useState("Rider");

  // Fetch token from local storage
  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
  }, []);

  // Fetch drivers list when token is available
  useEffect(() => {
    if (token && userId) {
      dispatch(singleDriver(userId, token));
    }
  }, [dispatch, token, userId]);

  const onRefresh = useCallback(() => {
    if (token) {
      dispatch(singleDriver(userId, token));
    }
  }, [dispatch, token, userId]);

  // Handle delete confirmation
  const confirmDelete = (driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

  // Handle delete action
  const handleConfirmDelete = () => {
    if (selectedDriver) {
      dispatch(removeDriver(selectedDriver._id, token));
      setOpenDialog(false);
      onRefresh();
    }
  };

  return (
    <div className="rider-container">
      {/* Header */}
      <Sidebar />
      <div className="rider-list-header">
        <h1>All Riders</h1>
        <button
          className="btn-add-rider"
          onClick={() => navigate("/riderregister")}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation-container">
        <Button
          variant="contained"
          className={`tab-button ${activeTab === "Assign" ? "active" : ""}`}
          onClick={() => navigate("/assignlist")}
        >
          Assign
        </Button>

        <Button
          variant="contained"
          className={`tab-button ${activeTab === "Rider" ? "active" : ""}`}
          onClick={() => setActiveTab("Rider")}
        >
          Rider
        </Button>
      </div>

      {/* Driver List */}
      <div className="driver-list-container">
        {loading ? (
          <CircularProgress />
        ) : error || !drivers?.length ? (
          <Typography variant="h6" color="error" align="center">
            No Drivers Found.
          </Typography>
        ) : (
          <div className="driver-card-wrapper">
            {drivers.map((driver) => (
              <Card key={driver._id} className="driver-card">
                <CardContent>
                  {/* Delete Button */}
                  <IconButton
                    className="delete-button"
                    color="error"
                    onClick={() => confirmDelete(driver)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: "auto",
                      left: "auto",
                      zIndex: 10,
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <img
                    src={driver.image?.url || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="driver-image"
                  />
                  <Typography variant="h6">
                    {driver.firstName} {driver.lastName}
                  </Typography>
                  <Typography>
                    Approved:{" "}
                    {driver.approvedAt ? "✅ Approved" : "❌ Not Approved"}
                  </Typography>
                  <Typography>
                    Available:{" "}
                    {driver.isAvailable ? "✅ Available" : "❌ Unavailable"}
                  </Typography>
                  {driver.approvedAt && (
                    <div className="driver-actions">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          navigate(`/assigndelivery/${driver._id}`, {
                            state: { driver },
                          })
                        }
                      >
                        Assign
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          navigate(`/riderdetails/${driver._id}`, {
                            state: { driver },
                          })
                        }
                      >
                        View
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {selectedDriver?.firstName}{" "}
              {selectedDriver?.lastName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default RiderList;
