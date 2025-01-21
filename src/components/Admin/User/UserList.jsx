import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, softDeleteUser, restoreUser } from "@redux/Actions/userActions";
import Sidebar from "../sidebar";
import "../../../assets/css/userlist.css";
import {getToken} from "@utils/helpers";

const UserList = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const { loading, users, error } = useSelector((state) => state.allUsers);
  const [isFetched, setIsFetched] = useState(false); // Track if users have been fetched

  // Fetch users only when token changes or component mounts
  useEffect(() => {
    if (token && !isFetched) {
      dispatch(getAllUsers(token));
      setIsFetched(true); // Mark as fetched after getting the users
    }
  }, [dispatch, token, isFetched]);

  // Soft delete user
  const handleSoftDelete = (userId) => {
    dispatch(softDeleteUser(userId, token)); // Dispatch the soft delete action
  };

  // Restore user
  const handleRestore = (userId) => {
    dispatch(restoreUser(userId, token)); // Dispatch the restore action
    alert("User restored successfully!"); // Notify the user
  };

  return (
    <div className="user-list-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-gray-50 p-6">
          {/* Loader or Error Handling */}
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: "red" }}>Error: {error}</div>
          ) : users.length === 0 ? (
            <div>No users found.</div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Profile Image</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
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
                      {/* Soft delete or restore */}
                      {!user.isDeleted ? (
                        <button onClick={() => handleSoftDelete(user._id)} className="delete-btn">
                          Soft Delete
                        </button>
                      ) : (
                        <button onClick={() => handleRestore(user._id)} className="restore-btn">
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;