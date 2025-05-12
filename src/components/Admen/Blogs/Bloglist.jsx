import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../sidebar";
import "@assets/css/bloglists.css";
import { getBlog, deleteBlog } from "@redux/Actions/blogActions";
import BlogInfo from "../../cooperative/Blog/BlogInfo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogLists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, blogs = [], error } = useSelector((state) => state.allBlogs);
  const { error: deleteError } = useSelector((state) => state.deleteBlog);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State for confirmation modal
  const [blogToDelete, setBlogToDelete] = useState(null); // Track the blog to delete
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  useEffect(() => {
    if (deleteError) {
      toast.error("Error deleting blog: " + deleteError);
    }
  }, [deleteError]);

  const handleDelete = async () => {
    if (blogToDelete) {
      await dispatch(deleteBlog(blogToDelete));
      dispatch(getBlog());
      setIsConfirmModalOpen(false); // Close the modal
      toast.success("Blog deleted successfully!");
    }
  };

  const openDeleteConfirmation = (blogId) => {
    setBlogToDelete(blogId);
    setIsConfirmModalOpen(true); // Open the modal
  };

  const handleEdit = (blog) => {
    navigate(`/blogupdate/${blog._id}`, { state: { blog } });
    toast.info("Redirecting to edit blog...");
  };

  const handleOpenModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="blog-list-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-white-100 p-6">
          <div className="blog-list-header">
            <h1 className="blog-title">Blog List</h1>
            <button
              className="btn-add-product"
              onClick={() => {
                navigate("/blogcreate");
                toast.info("Redirecting to create blog...");
              }}
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
              {blogs.length === 0 ? (
                <p className="loading-text">No blogs available.</p>
              ) : (
                <>
                  <div className="blog-container">
                    <div className="blog-grid">
                      {paginatedBlogs.map((blog) => (
                        <div
                          key={blog._id}
                          className="p-4 border-b flex justify-between items-center cursor-pointer"
                          onClick={() => handleOpenModal(blog)}
                        >
                          <span className="text-gray-800 font-medium">
                            {blog.title}
                          </span>
                          <div className="actions flex space-x-2">
                            <i
                              className="fa-regular fa-pen-to-square text-yellow-500 cursor-pointer"
                              title="Edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(blog);
                              }}
                            ></i>
                            <i
                              className="fa-solid fa-trash text-red-500 cursor-pointer"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteConfirmation(blog._id);
                              }}
                            ></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
      <BlogInfo
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={selectedBlog}
      />

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="confirmation-modal">
          <div className="confirmation-modal-content">
            <h3>Confirmation</h3>
            <p>Are you sure you want to delete this blog?</p>
            <div className="confirmation-modal-actions">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="confirm-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default BlogLists;
