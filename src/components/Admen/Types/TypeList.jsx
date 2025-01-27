import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import "@assets/css/typelist.css";
import { useDispatch, useSelector } from "react-redux";
import { typeList, typeDelete } from "@redux/Actions/typeActions";

const TypeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { loading, types = [], error } = useSelector((state) => state.types);
  const { success: deleteSuccess, error: deleteError } = useSelector(
    (state) => state.typesDelete
  );

  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 10; // Items per page

  useEffect(() => {
    dispatch(typeList());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(typeList());
      alert("Type deleted successfully!");
    }
    if (deleteError) {
      alert("Error deleting type: " + deleteError);
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const handleDelete = (typeId) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      dispatch(typeDelete(typeId));
    }
  };

  const handleEdit = (type) => {
    navigate(`/typeupdate/${type._id}`, { state: { type } }); 
  };

  // Calculate pagination
  const totalPages = Math.ceil(types.length / itemsPerPage);
  const paginatedTypes = types.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="type-list-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-white-100 p-6">
          <div className="type-list-header">
            <h1 className="type-title">Type List</h1>
            <button
              className="btn-primary"
              onClick={() => navigate("/typecreate")}
            >
              Add Type
            </button>
          </div>
          {loading ? (
            <div className="loading-container">
              <p className="loading-text">Loading...</p>
            </div>
          ) : error ? (
            <p className="error-text">Error: {error}</p>
          ) : (
            <div className="bg-white shadow rounded-lg p-4">
              {types.length === 0 ? (
                <p className="loading-text">No types available.</p>
              ) : (
                <>
                  <div className="type-container">
                    <div className="type-grid">
                      {paginatedTypes.map((type) => (
                        <div
                          key={type._id}
                          className="p-4 border-b flex justify-between items-center"
                        >
                          <span className="text-gray-800 font-medium">
                            {type.typeName}
                          </span>
                          <div className="actions flex space-x-2">
                            <i
                              className="fa-regular fa-pen-to-square text-yellow-500 cursor-pointer"
                              title="Edit"
                              onClick={() => handleEdit(type)}
                            ></i>

                            <i
                              className="fa-solid fa-trash text-red-500 cursor-pointer"
                              title="Delete"
                              onClick={() => handleDelete(type._id)}
                            ></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="pagination flex justify-center items-center mt-4 space-x-2">
                    <button
                      className="btn-secondary"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`btn-page ${
                            page === currentPage ? "btn-active" : ""
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="btn-secondary"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypeList;
