import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../cooperative/sidebar";
import "@assets/css/bloglists.css";
import { getBlog, deleteBlog } from "@redux/Actions/blogActions";
import BlogInfo from "../../cooperative/Blog/BlogInfo";

const BlogListCoop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, blogs = [], error } = useSelector((state) => state.allBlogs);
  const { error: deleteError } = useSelector((state) => state.deleteBlog);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  useEffect(() => {
    if (deleteError) {
      alert("Error deleting blog: " + deleteError);
    }
  }, [deleteError]);

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
            <h1>Bloglist</h1>
            {/* <button className="btn-primary" onClick={() => navigate("/blogcreate")}>
              Add Blog
            </button> */}
            {/* <button
              className="btn-add-product"
              onClick={() => navigate("/blogcreate")}
            >
              <i className="fa-solid fa-plus"></i>
            </button> */}
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
    </div>
  );
};

export default BlogListCoop;
