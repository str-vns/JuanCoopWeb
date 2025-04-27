import React, { useEffect, useState } from "react";
import "@assets/css/aboutUs.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedPosts, likePost, addComment } from "@src/redux/Actions/postActions";
import Navbar from "../layout/navbar";
import { FaSearch, FaHeart, FaComment, FaThumbsUp, FaRegMeh, FaRegTired, FaRegLaugh } from "react-icons/fa";
import { getToken, getCurrentUser } from "@utils/helpers";
import "@assets/css/memberforumlist.css"; 

const MemberForumList = () => {
    const dispatch = useDispatch();
  const user = getCurrentUser();
  const token = getToken();
  const userId = user?._id;

  const { posts, loading } = useSelector((state) => state.post);
  const [comments, setComments] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showComments, setShowComments] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModalComments, setShowModalComments] = useState(false);

  useEffect(() => {
    dispatch(fetchApprovedPosts());
  }, [dispatch]);

  const handleLike = (postId) => {
  dispatch(likePost(postId, userId)).then(() => {
    dispatch(fetchApprovedPosts());
  });
};

  const handleCommentChange = (postId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };

  const handleComment = (postId) => {
    if (!comments[postId]) {
      alert("Please enter a comment.");
      return;
    }

    const commentData = {
      user: userId,
      post: postId,
      comment: comments[postId],
    };

    dispatch(addComment(commentData, token));
    alert("Comment added successfully!");

    // Clear input
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: "",
    }));
    dispatch(fetchApprovedPosts());
  };

  // Toggle comments dropdown
  const toggleComments = (postId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const toggleModalComments = () => {
    setShowModalComments((prevState) => !prevState);
  };

  return (
    <>
      <Navbar />
      <div className="forumlist-coop-container">
      <div className="forumlist-coop-content">
        {/* Search Bar */}
        <div className="forumlist-coop-search-bar">
          <div className="forumlist-coop-search">
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="forumlist-coop-search-icon" />
          </div>
        </div>

        {/* Loading State */}
        {loading && <div className="forumlist-coop-loading">Loading posts...</div>}

        {/* Forum Posts */}
        <div className="forumlist-coop-posts">
          {posts
            .filter((post) => post.content.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((post) => (
              <div key={post._id} className="forumlist-coop-card">
                <div className="forumlist-coop-card-header" onClick={() => setSelectedPost(post)}>
                  <img
                    src={post.author?.image?.url || "default-user.png"}
                    alt="Profile"
                    className="forumlist-coop-avatar"
                  />
                  <div>
                    <h4>{post.author?.firstName} {post.author?.lastName}</h4>
                    <span className="forumlist-coop-date">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Unknown Date"}
                    </span>
                  </div>
                </div>
                <p className="forumlist-coop-post-content">
                  {post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}
                  {post.image?.length > 0 && (
                    <div className="usercoop-image-container">
                    {post.image.map((img, index) => (
                        <img key={index} src={img.url} alt="Post" className="usercoop-forumlist-image" />
                    ))}
                    </div>
                  )}
                </p>
                <div className="forumlist-coop-actions">
                  <button onClick={() => handleLike(post._id)} className="forumlist-coop-like">
                    <FaHeart /> {post.likeCount}
                  </button>
                  <button onClick={() => toggleComments(post._id)} className="forumlist-coop-comment">
                    <FaComment /> {post.comments?.length}
                  </button>
                  <div className={`sentiment-label ${post.overallSentimentLabel}`}>
                    {post.overallSentimentLabel === "positive" && (
                      <span className="positive"><FaRegLaugh /> Positive</span>
                    )}
                    {post.overallSentimentLabel === "neutral" && (
                      <span className="neutral"><FaRegMeh /> Neutral</span>
                    )}
                    {post.overallSentimentLabel === "negative" && (
                      <span className="negative"><FaRegTired /> Negative</span>
                    )}
                  </div>
                </div>

                {/* Comments Dropdown */}
                {showComments[post._id] && (
                  <div className="forumlist-coop-comments">
                    <h3>Comments</h3>
                    {post.comments?.length > 0 ? (
                      [...post.comments] // Create a copy to avoid mutating original data
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date (most recent first)
                        .map((comment, index) => (
                          <div key={index} className="forumlist-coop-comment-item">
                            {/* Row: Name, Comment, and Sentiment Label */}
                            <div className="forumlist-coop-comment-content flex">
                              <p>
                                <strong>{comment.user?.firstName} {comment.user?.lastName}:</strong> {comment.comment}
                              </p>
                              <div className={`sentiment-label ${comment.sentimentLabel}`}>
                                {comment.sentimentLabel === "positive" && (
                                  <span className="positive"><FaRegLaugh /></span>
                                )}
                                {comment.sentimentLabel === "neutral" && (
                                  <span className="neutral"><FaRegMeh /></span>
                                )}
                                {comment.sentimentLabel === "negative" && (
                                  <span className="negative"><FaRegTired /></span>
                                )}
                              </div>
                            </div>

                            {/* Date below */}
                            <p className="comment-date">
                              {comment.createdAt
                                ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Unknown Date"}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
                )}


                 {/* Comment Input */}
                 <div className="forumlist-coop-add-comment">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={comments[post._id] || ""}
                      onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    />
                    <button onClick={() => handleComment(post._id)}>Post</button>
                  </div>
              </div>
            ))}
        </div>

        {/* Post Modal */}
        {selectedPost && (
          <div className="forumlist-coop-modal">
            <div className="forumlist-coop-modal-content">
              <span className="forumlist-coop-close" onClick={() => setSelectedPost(null)}>&times;</span>
              <h2>{selectedPost.content}</h2>
              {selectedPost.image?.length > 0 ? (
                selectedPost.image.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url || "/default-placeholder.png"}
                    alt="Post Image"
                    className="forumlist-coop-post-image"
                  />
                ))
              ) : (
                <img
                  src="/default-placeholder.png"
                  alt="Default Post Image"
                  className="forumlist-coop-post-image"
                />
              )}
              <p>
                By {selectedPost.author?.firstName} {selectedPost.author?.lastName} on{" "}
                {selectedPost.createdAt
                  ? new Date(selectedPost.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Unknown Date"}
              </p>

              <div className="forumlist-coop-modal-actions">
                {/* Like and Comment buttons in one row */}
                <div className="forumlist-coop-actions-buttons">
                  <button onClick={() => handleLike(selectedPost._id)} className="forumlist-coop-like">
                    <FaThumbsUp /> {selectedPost.likeCount}
                  </button>
                  <button onClick={() => toggleModalComments(selectedPost._id)} className="forumlist-coop-comment">
                    <FaComment /> {selectedPost.comments?.length}
                  </button>
                </div>

                {/* Sentiment Label */}
                <div className={`sentiment-label ${selectedPost.overallSentimentLabel}`}>
                  {selectedPost.overallSentimentLabel === "positive" && (
                    <span className="positive"><FaRegLaugh /> Positive</span>
                  )}
                  {selectedPost.overallSentimentLabel === "neutral" && (
                    <span className="neutral"><FaRegMeh /> Neutral</span>
                  )}
                  {selectedPost.overallSentimentLabel === "negative" && (
                    <span className="negative"><FaRegTired /> Negative</span>
                  )}
                </div>
              </div>


              {/* Comments Dropdown Inside Modal */}
              {showModalComments && (
                <div className="forumlist-coop-comments">
                  <h3>Comments</h3>
                  {selectedPost.comments?.length > 0 ? (
                    [...selectedPost.comments] // Create a copy to avoid mutating the original data
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date (most recent first)
                      .map((comment, index) => (
                        <div key={index} className="forumlist-coop-comment-item">
                          {/* Row: Name, Comment, and Sentiment Label */}
                          <div className="forumlist-coop-comment-content flex">
                            <p>
                              <strong>{comment.user?.firstName} {comment.user?.lastName}:</strong> {comment.comment}
                            </p>
                            <div className={`sentiment-label ${comment.sentimentLabel}`}>
                              {comment.sentimentLabel === "positive" && (
                                <span className="positive"><FaRegLaugh /></span>
                              )}
                              {comment.sentimentLabel === "neutral" && (
                                <span className="neutral"><FaRegMeh /></span>
                              )}
                              {comment.sentimentLabel === "negative" && (
                                <span className="negative"><FaRegTired /></span>
                              )}
                            </div>
                          </div>

                          {/* Date below */}
                          <p className="comment-date">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Unknown Date"}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              )}



              {/* Comment Input */}
              <div className="forumlist-coop-add-comment">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={comments[selectedPost._id] || ""}
                  onChange={(e) => handleCommentChange(selectedPost._id, e.target.value)}
                  className="forumlist-coop-comment-input"
                />
                <button
                  onClick={() => {
                    handleComment(selectedPost._id);
                    setSelectedPost(null); // Close modal after posting comment
                  }}
                  className="forumlist-coop-post-comment"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
};

export default MemberForumList;