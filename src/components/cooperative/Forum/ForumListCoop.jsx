import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedPosts, likePost } from "@src/redux/Actions/postActions";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import { FaSearch, FaThumbsUp, FaComment, FaShareAlt } from "react-icons/fa";
import "@assets/css/coopforumlist.css"; // Import the new CSS file

const ForumListCoop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [comments, setComments] = useState({});
  const { posts, loading } = useSelector((state) => state.post);

  console.log(posts);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchApprovedPosts());
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(likePost(postId));
    dispatch(fetchApprovedPosts());
    alert("Like a Post successfully!");
  };  

  const handleShare = (postId) => {
    console.log('Shared post with ID:', postId);
  };

  const handleCommentChange = (postId, value) => {
    setComments({
      ...comments,
      [postId]: value,
    });
  };

  return (
    <div className="forum-container">
      <Sidebar />
      <div className="forum-content">
        {/* Search Bar */}
        <div className="forum-search-bar">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search threads..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button className="add-post-btn" onClick={() => navigate("/forumpostlist")}>My Post</button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
            <span>Loading posts...</span>
          </div>
        )}

        {/* Forum Posts */}
        <div className="space-y-4">
          {posts
            .filter((post) =>
              post.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((post) => (
              <div key={post._id} className="forum-post-card">
                {/* Post Images */}
                {post.image?.length > 0 ? (
                  post.image.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url || "/default-placeholder.png"}
                      alt={post.content || "Post Image"}
                      className="post-image"
                    />
                  ))
                ) : (
                  <img
                    src="/default-placeholder.png"
                    alt="Default Post Image"
                    className="post-image"
                  />
                )}

                {/* Post Content */}
                <h2 className="forum-post-title">{post.content}</h2>

                {/* Post Info */}
                <p className="forum-post-info">
                  {post.date} | {post.likeCount} likes | Last post by {" "}
                  {post.author?.firstName} {post.author?.lastName}
                </p>

                {/* Post Actions */}
                <div className="post-actions">
                  {/* Like Button */}
                  <button onClick={() => handleLike(post._id)} className="like-btn">
                    <FaThumbsUp className="mr-2" /> {post.likeCount}
                  </button>

                  {/* Share Button */}
                  <button onClick={() => handleShare(post._id)} className="share-btn">
                    <FaShareAlt className="mr-2" /> Share
                  </button>
                  
                  {/* Comment Section */}
                  <textarea
                    value={comments[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    className="comment-input"
                    placeholder="Add a comment..."
                  ></textarea>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ForumListCoop;