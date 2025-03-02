import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  categoryList as getCategories,
  categoryDelete,
} from "@redux/Actions/categoryActions";
import Sidebar from "../sidebar";
import "@assets/css/categorylist.css";

const CategoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    categories = [],
    error,
  } = useSelector((state) => state.categories);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Refresh categories
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getCategories());
    } catch (err) {
      console.error("Error refreshing categories:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleAddCategory = () => {
    navigate("/category-create");
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    navigate(`/category-update/${category._id}`, { state: { category } });
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await dispatch(categoryDelete(categoryId)); // Wait for delete action
        dispatch(getCategories()); // Refresh the category list after deletion
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="category-list-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-white-100 p-6">
          {/* <div className="category-list-header">
            <h1 className="category-title">Category List</h1>
            <button className="btn-primary" onClick={handleAddCategory}>
            <i className="fa-solid fa-plus"></i>
            </button>
          </div> */}

          <div className="category-list-header">
            <h1>All Category</h1>
            <button
              className="btn-add-category"
              onClick={handleAddCategory}
            >
              <i className="fa-solid fa-plus"></i>
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
              {categories.length === 0 ? (
                <p className="loading-text">No Category available.</p>
              ) : (
                <>
                  <div className="category-container">
                    <div className="category-grid">
                      {paginatedCategories.map((category) => (
                        <div
                          key={category._id}
                          className="p-4 border-b flex justify-between items-center"
                        >
                          <span className="text-gray-800 font-medium">
                            {category.categoryName}
                          </span>
                          <div className="actions flex space-x-2">
                            <i
                              className="fa-regular fa-pen-to-square text-yellow-500 cursor-pointer"
                              title="Edit"
                              onClick={() => handleEditCategory(category)}
                            ></i>
                            <i
                              className="fa-solid fa-trash text-red-500 cursor-pointer"
                              title="Delete"
                              onClick={() => handleDeleteCategory(category._id)}
                            ></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="pagination">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
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

export default CategoryList;
