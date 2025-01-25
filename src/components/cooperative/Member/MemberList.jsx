import React, { useState, useEffect, useCallback, useContext } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import { FaRedo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { memberInactive } from "@redux/Actions/memberActions";
import AuthGlobal from "../../../redux/Store/AuthGlobal";
import { getToken, getCurrentUser } from "@utils/helpers";
import "../../../assets/css/productarchive.css";

const MemberList = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const token = getToken(); 
  const userId = currentUser?._id;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { loading, members, error } = useSelector((state) => state.memberList);

  useEffect(() => {
    if (userId && token) {
      dispatch(memberInactive(userId, token));
    }
  }, [userId, token, dispatch]);

  const handleRestore = (id) => {
    // Implement logic to restore inactive members
  };

  const filteredMembers = members?.filter(
    (member) =>
      (member.status === statusFilter || statusFilter === "All") &&
      (`${member.userId?.firstName} ${member.userId?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="product-archive-list-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="flex-1 bg-gray-50 p-6">
          <div className="archive-card">
            <div className="archive-header">
              <h1 className="archive-title">Member List</h1>
              <div className="archive-filters">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  onChange={(e) => setStatusFilter(e.target.value)}
                  value={statusFilter}
                  className="filter-select"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              {loading ? (
                <div className="loading">Loading...</div>
              ) : error ? (
                <div className="error">Error fetching members.</div>
              ) : filteredMembers.length === 0 ? (
                <div className="empty">No members found.</div>
              ) : (
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.map((member) => (
                      <tr key={member._id}>
                        <td>{member.userId?.firstName} {member.userId?.lastName}</td>
                        <td>{member.userId?.email}</td>
                        <td>{member.status}</td>
                        <td>
                          {member.status === "Inactive" && (
                            <button
                              className="restore-button"
                              onClick={() => handleRestore(member._id)}
                            >
                              <FaRedo />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pagination">
              <button
                className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberList;