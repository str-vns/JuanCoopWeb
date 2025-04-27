import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedPosts, likePost, addComment } from "@src/redux/Actions/postActions";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import { FaSearch, FaThumbsUp, FaComment, FaRegLaugh, FaRegMeh, FaRegTired, FaExclamationCircle } from "react-icons/fa";
import { getToken, getCurrentUser } from "@utils/helpers";
import "@assets/css/coopforumlist.css";

const ForumListCoop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const token = getToken();
  const userId = user?._id;

  const { posts, loading } = useSelector((state) => state.post);
  const [comments, setComments] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showComments, setShowComments] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModalComments, setShowModalComments] = useState(false);

  const badWords = [
    // English Profanity
    "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dumbass", "jackass", "motherfucker",
    "dipshit", "piss", "cock", "dick", "prick", "slut", "whore", "nigger", "faggot", "twat",
    "pussy", "bollocks", "wanker", "son of a bitch", "douchebag", "arsehole", "bloody hell",
    "goddamn", "hell no", "screw you", "retard", "idiot", "moron",
  
    // Tagalog Profanity
    "tangina", "gago", "putangina", "ulol", "bobo", "tanga", "inutil", "bwisit", "pakyu", 
    "siraulo", "peste", "punyeta", "lecheng", "lintik", "hayop ka", "tarantado", "gunggong",
    "ampota", "bwesit", "kantot", "hindot", "burat", "jakol", "salsal", "iyot", "chupa",
    "pakyu ka", "hindutan", "bilat", "pokpok", "bayag", "pwet", "supalpal", "lapastangan"
  ];

  // Function to check if a comment contains bad words
  const containsBadWord = (comment) => {
    return badWords.some((word) => {
      const regex = new RegExp(word, "gi");
      return regex.test(comment);
    });
  };

  useEffect(() => {
    dispatch(fetchApprovedPosts());
  }, [dispatch]);

  // Function to censor bad words in comments
const censorComment = (comment) => {
  if (!comment) return comment;

  return badWords.reduce((acc, word) => {
    const regex = new RegExp(word, "gi");
    return acc.replace(regex, (match) => {
      // Keep the first letter, replace the rest with "*"
      const firstLetter = match.charAt(0);
      const stars = "*".repeat(match.length - 1);
      return firstLetter + stars;
    });
  }, comment);
};


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
  
    dispatch(addComment(commentData, token)).then(() => {
      alert("Comment added successfully!");
      // Clear input
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: "",
      }));
      dispatch(fetchApprovedPosts()); // Refresh posts to reflect the new comment
    });
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
    <div className="forumlist-coop-container">
      <Sidebar />
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
          <button className="forumlist-coop-add-post" onClick={() => navigate("/forumpostlist")}>
            My Post
          </button>
        </div>

        {/* Loading State */}
        {loading && <div className="forumlist-coop-loading">Loading posts...</div>}

        {/* Forum Posts */}
        <div className="forumlist-coop-posts">
          {posts
            .filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
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
                <p className="forumlist-coop-post-title">
                  {post.title}
                </p>
                <p className="forumlist-coop-post-content">
                  {post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}
                </p>
                {post.image?.length > 0 && (
                <div className="usercoop-image-container">
                  {post.image.map((img, index) => (
                    <img key={index} src={img.url} alt="Post" className="usercoop-forumlist-image" />
                  ))}
                </div>
              )}
                <div className="forumlist-coop-actions">
                  <button onClick={() => handleLike(post._id)} className="forumlist-coop-like">
                    <FaThumbsUp /> {post.likeCount}
                  </button>
                  <button onClick={() => toggleComments(post._id)} className="forumlist-coop-comment">
                    <FaComment /> {post.comments?.length}
                  </button>
                  <div className={`sentiment-label ${post.overallSentimentLabel}`}>
                    {post.overallSentimentLabel === "positive" && (
                      <span className="sentiment-positive"><FaRegLaugh /> Positive</span>
                    )}
                    {post.overallSentimentLabel === "neutral" && (
                      <span className="sentiment-neutral"><FaRegMeh /> Neutral</span>
                    )}
                    {post.overallSentimentLabel === "negative" && (
                      <span className="sentiment-negative"><FaRegTired /> Negative</span>
                    )}
                  </div>
                </div>

                {/* Comments Dropdown */}
                {showComments[post._id] && (
                  <div className="forumlist-coop-comments">
                    <h3>Comments</h3>
                    {post.comments?.length > 0 ? (
                      [...post.comments]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((comment, index) => (
                          <div key={index} className="forumlist-coop-comment-item">
                            {/* Row: Name, Comment, and Sentiment Label */}
                            <div className="forumlist-coop-comment-content flex">
                            <p className="comment-date">
                              {comment.createdAt
                                ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Unknown Date"}
                            </p>
                              <p>
                                <strong>{comment.user?.firstName} {comment.user?.lastName}:</strong> {censorComment(comment.comment)}
                              </p>
                              <div className={`sentiment-label ${comment.sentimentLabel}`} style={{ color: "black" }} >
                                {comment.sentimentLabel === "positive" && (
                                  <span className="sentiment-positive"><FaRegLaugh /></span>
                                )}
                                {comment.sentimentLabel === "neutral" && (
                                  <span className="sentiment-neutral"><FaRegMeh /></span>
                                )}
                                {comment.sentimentLabel === "negative" && (
                                  <span className="sentiment-negative"><FaRegTired /></span>
                                )}
                              </div>
                              {/* Censored Comment Icon */}
                              {containsBadWord(comment.comment) && (
                                <FaExclamationCircle
                                  className="censored-icon"
                                  title="This comment was censored due to inappropriate language."
                                  onClick={() => alert("This comment was censored due to inappropriate language.")}
                                />
                              )}
                            </div>
                          </div>
                        ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
                )}

                {/* Comment Input */}
                <div className="forumlist-coop-add-comment flex items-center gap-1 p-1 border-t border-gray-300">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={comments[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    className="flex-1 h-8 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-yellow-500 transition-all placeholder-left"
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-600 transition-all"
                  >
                    Post
                  </button>
                </div>

              </div>
            ))}
        </div>
        {/* Post Modal */}
                {selectedPost && (
                  <div className="forumlist-coop-modal">
                    <div className="forumlist-coop-modal-content">
                      <span className="forumlist-coop-close" onClick={() => setSelectedPost(null)}>&times;</span>
                      <h1 style={{ fontWeight: 'bold', fontSize: '20px' }}>{selectedPost.title}</h1>          
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
                                                  <p className="comment-date">
                                                                                {comment.createdAt
                                                                                  ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                                                                      year: "numeric",
                                                                                      month: "short",
                                                                                      day: "numeric",
                                                                                    })
                                                                                  : "Unknown Date"}
                                                                              </p>
                                                                                <p>
                                                                                  <strong>{comment.user?.firstName} {comment.user?.lastName}:</strong> {censorComment(comment.comment)}
                                                                                </p>
                                                                                <div className={`sentiment-label ${comment.sentimentLabel}`}>
                                                                                  {comment.sentimentLabel === "positive" && (
                                                                                    <span className="sentiment-positive"><FaRegLaugh /></span>
                                                                                  )}
                                                                                  {comment.sentimentLabel === "neutral" && (
                                                                                    <span className="sentiment-neutral"><FaRegMeh /></span>
                                                                                  )}
                                                                                  {comment.sentimentLabel === "negative" && (
                                                                                    <span className="sentiment-negative"><FaRegTired /></span>
                                                                                  )}
                                                                                </div>
                                                                                {/* Censored Comment Icon */}
                                                                                {containsBadWord(comment.comment) && (
                                                                                  <FaExclamationCircle
                                                                                    className="censored-icon"
                                                                                    title="This comment was censored due to inappropriate language."
                                                                                    onClick={() => alert("This comment was censored due to inappropriate language.")}
                                                                                  />
                                                                                )}
                                                                              </div>
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
  );
};

export default ForumListCoop;