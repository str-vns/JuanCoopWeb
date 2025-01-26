import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "@redux/Actions/blogActions";
import Header from "../header";
import Sidebar from "../sidebar";
import BlogInfo from "./BlogInfo";
import "../../../assets/css/coopbloglist.css";

const BlogList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const { loading, blogs, error } = useSelector((state) => state.allBlogs);

  // Fetch blogs when the component loads
  React.useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  const handleReadMoreClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="blog-list-container">
      <Sidebar/>
      <div className="flex flex-col w-full">
        <Header />
        <main className="p-6">
          <div className="content">
            <h1 className="title">Blog Posts</h1>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : error ? (
              <div className="error">Error: {error}</div>
            ) : blogs.length === 0 ? (
              <div className="empty">No blogs available.</div>
            ) : (
              <div className="blog-container">
                <div className="blog-grid">
                  {blogs.map((post) => (
                    <div key={post._id} className="blog-card">
                      {/* Image Section */}

                      <div className="blog-body">
                        <h2 className="blog-title">{post.title}</h2>
                        <p className="blog-date">
                          Published on:{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        <p className="blog-excerpt">
                          {post.content.slice(0, 100)}...
                        </p>
                        <div className="blog-actions">
                          <button
                            onClick={() => handleReadMoreClick(post)}
                            className="read-more-btn"
                          >
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <BlogInfo
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={selectedPost}
      />
    </div>
  );
};

export default BlogList;