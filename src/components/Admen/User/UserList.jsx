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
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(softDeleteUser(userId, token));
    }
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
            <input
              type="text"
              placeholder="Search users by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="user-list-table-container">
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="center-text">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan="5" className="center-text error-text">Error: {error}</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" className="center-text">No users found.</td></tr>
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
                          <button onClick={() => handleSoftDelete(user._id)} className="action-btn delete-btn">
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        ) : (
                          <button onClick={() => handleRestore(user._id)} className="action-btn restore-btn">
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
