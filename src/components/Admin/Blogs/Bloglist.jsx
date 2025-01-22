import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "@redux/Actions/blogActions";
import Sidebar from "../sidebar";
import BlogInfo from "../../Cooperative/Blog/BlogInfo";
import "../../../assets/css/bloglists.css";

const BlogLists = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();
  const { loading, blogs, error } = useSelector((state) => state.allBlogs);

  // Fetch blogs when the component loads
  useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  // Refresh blogs
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getBlog());
    } catch (err) {
      console.error("Error refreshing blogs:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Update logic for pagination if required
  };

  // Open modal with selected post
  const handleReadMoreClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Placeholder for delete functionality
  const handleDelete = (id) => {
    console.log(`Delete blog with ID: ${id}`);
    // Add your delete logic here
  };

  return (
    <div className="blog-list-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-white-100 p-6">
          <div className="blog-list-header">
            <h1 className="blog-title">Blog List</h1>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              Add Blog
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
                <p className="loading-text">No Blogs available.</p>
              ) : (
                <>
                  <div className="blog-container">
                    <div className="blog-grid">
                      {blogs.map((post) => (
                        <div
                          key={post._id}
                          className="p-4 border-b flex justify-between items-center"
                        >
                          <span className="text-gray-800 font-medium">
                            {post.title}
                          </span>
                          <div className="actions flex space-x-2">
                            <i
                              className="fa-regular fa-pen-to-square text-yellow-500 cursor-pointer"
                              title="Edit"
                              onClick={() => console.log("Edit clicked", post)}
                            ></i>
                            <i
                              className="fa-solid fa-trash text-red-500 cursor-pointer"
                              title="Delete"
                              onClick={() => handleDelete(post._id)}
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
      {isModalOpen && (
        <BlogInfo
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          post={selectedPost}
        />
      )}
    </div>
  );
};

export default BlogLists;
