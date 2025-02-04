import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../sidebar";
import "@assets/css/bloglists.css";
import { getBlog, deleteBlog } from "@redux/Actions/blogActions";
import BlogInfo from "../../cooperative/Blog/BlogInfo";

const BlogLists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, blogs = [], error } = useSelector((state) => state.allBlogs);
  const { success: deleteSuccess, error: deleteError } = useSelector(
    (state) => state.deleteBlog
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(getBlog());
      alert("Blog deleted successfully!");
    }
    if (deleteError) {
      alert("Error deleting blog: " + deleteError);
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const handleDelete = (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog(blogId));
    }
  };

  const handleEdit = (blog) => {
    navigate(`/blogupdate/${blog._id}`, { state: { blog } });
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
            <button className="btn-primary" onClick={() => navigate("/blogcreate")}>
              Add Blog
            </button>
          </div>
          {loading ? (
            <div className="loading-container"><p className="loading-text">Loading...</p></div>
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
                          <span className="text-gray-800 font-medium">{blog.title}</span>
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
                                handleDelete(blog._id);
                              }}
                            ></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pagination flex justify-center items-center mt-4 space-x-2">
                    <button className="btn-secondary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`btn-page ${page === currentPage ? "btn-active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button className="btn-secondary" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <BlogInfo isOpen={isModalOpen} onClose={handleCloseModal} post={selectedBlog} />
    </div>
  );
};

export default BlogLists;
