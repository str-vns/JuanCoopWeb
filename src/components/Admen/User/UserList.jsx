import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, softDeleteUser, restoreUser } from "@redux/Actions/userActions";
import Sidebar from "../sidebar";
import "@assets/css/userlist.css";
import { getToken } from "@utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUndo, faSearch } from "@fortawesome/free-solid-svg-icons";

const UserList = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const { loading, users, error } = useSelector((state) => state.allUsers);
  const [isFetched, setIsFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token && !isFetched) {
      dispatch(getAllUsers(token));
      setIsFetched(true);
    }
  }, [dispatch, token, isFetched]);

  const handleSoftDelete = (userId) => {
    dispatch(softDeleteUser(userId, token));
  };

  const handleRestore = (userId) => {
    dispatch(restoreUser(userId, token));
    alert("User restored successfully!");
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list-container">
      <Sidebar />
      <div className="user-list-content">
        <div className="search-bar-container">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon"/>
            <input
              type="text"
              placeholder="Search users by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ outline: "none" }}
            />
          </div>
        </div>
        <div className="user-list-table-container">
          <div className="table-wrapper" style={{ width: "100%", minHeight: "400px" }}>
            <table className="user-table" style={{ width: "100%", tableLayout: "fixed" }}>
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>Profile</th>
                  <th style={{ width: "25%" }}>Full Name</th>
                  <th style={{ width: "25%" }}>Email</th>
                  <th style={{ width: "20%" }}>Role</th>
                  <th style={{ width: "15%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan="5" style={{ color: "red" }}>Error: {error}</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="5">No users found.</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className={user.isDeleted ? "deleted-user" : ""}>
                      <td>
                        <img
                          src={user.image?.url || "https://via.placeholder.com/150"}
                          alt="Profile"
                          className="profile-image"
                        />
                      </td>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}</td>
                      <td>
                        {!user.isDeleted ? (
                          <button onClick={() => handleSoftDelete(user._id)} className="delete-btn">
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        ) : (
                          <button onClick={() => handleRestore(user._id)} className="restore-btn">
                            <FontAwesomeIcon icon={faUndo} /> Restore
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
