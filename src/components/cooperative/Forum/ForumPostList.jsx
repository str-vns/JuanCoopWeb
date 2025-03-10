import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from "@utils/helpers";
import { getUserPost, deletePost } from '@src/redux/Actions/postActions';
import Sidebar from '../sidebar';
import ForumCreate from './ForumCreate';
import ForumUpdate from './ForumUpdate';
import '@assets/css/coopuserforumlist.css';
import { FaComment, FaHeart, FaRegLaugh, FaRegMeh, FaRegTired, FaThumbsUp } from 'react-icons/fa';

const ForumPostList = () => {
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const { loading, posts } = useSelector((state) => state.post);
  const [activeTab, setActiveTab] = useState('pending');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [showLikes, setShowLikes] = useState({});

  useEffect(() => {
    if (userId) dispatch(getUserPost(userId));
  }, [userId, dispatch]);

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
    alert("Post marked as deleted!");
    dispatch(getUserPost(userId)); // Add parentheses to call the function
  };

  const openEditModal = (post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const filteredPosts = posts?.filter(post => post.status === activeTab) || [];

  const toggleComments = (postId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const toggleLikes = (postId) => {
    setShowLikes((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  return (
    <div className="usercoop-forumlist-container">
      <Sidebar />
      <div className="usercoop-forumlist-content">
        <div className="usercoop-forumlist-header">
          <button className="usercoop-forumlist-create-btn" onClick={() => setIsCreateModalOpen(true)}>
            + Create New Post
          </button>
        </div>

        <div className="usercoop-forumlist-tabs">
          <button
            className={`usercoop-forumlist-tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Posts
          </button>
          <button
            className={`usercoop-forumlist-tab ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved Posts
          </button>
        </div>

        <div className="usercoop-forumlist-posts">
          {filteredPosts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post) => (
            <div key={post._id} className="usercoop-forumlist-post">
              <p className="usercoop-forumlist-content">{post.content}</p>

              {post.image?.length > 0 && (
                <div className="usercoop-image-container">
                  {post.image.map((img, index) => (
                    <img key={index} src={img.url} alt="Post" className="usercoop-forumlist-image" />
                  ))}
                </div>
              )}

              <span className="usercoop-forumlist-date">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Unknown Date"}
              </span>

              <div className="usercoop-forumlist-actions">
                {activeTab === "approved" && (
                  <>
                    <button onClick={() => toggleLikes(post._id)} className="usercoop-forumlist-comment flex gap-3" style={{ backgroundColor: "#FFA09B", color: "black", border: "none", padding: "10px" }}>
                      <FaHeart style={{ color: "red", fontSize: "20px" }}/> {post.likes?.length} Likes
                    </button>
                    <button onClick={() => toggleComments(post._id)} className="usercoop-forumlist-comment flex gap-3" style={{ backgroundColor: "#FFC785", color: "black", border: "none", padding: "10px" }}>
                      <FaComment style={{ color: "orange", fontSize: "20px" }}/> {post.comments?.length} Comments 
                    </button>
                    <div className="usercoop-forumlist-sentiment">
                      {post.overallSentimentLabel === "positive" && <span className="positive gap-2"><FaRegLaugh /> Positive</span>}
                      {post.overallSentimentLabel === "neutral" && <span className="neutral gap-2"><FaRegMeh /> Neutral</span>}
                      {post.overallSentimentLabel === "negative" && <span className="negative gap-2"><FaRegTired /> Negative</span>}
                    </div>
                  </>
                )}
              </div>

              {showComments[post._id] && (
                <div className="usercoop-forumlist-comments">
                  <h3>🗨️ Comments</h3>
                  {post.comments?.length > 0 ? (
                    post.comments
                      .slice()
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((comment) => (
                        <div key={comment._id} className="forumlist-coop-comment-item">
                          <div className="forumlist-coop-comment-content flex">
                            {comment.user?.image && (
                              <img src={comment.user.image?.url || "default-user.png"} alt="User" className="comment-avatar" />
                            )}
                            <p>
                              <strong>{comment.user?.firstName} {comment.user?.lastName}:</strong> {comment.comment}
                            </p>
                          </div>
                          <p className="comment-date">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
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

              {showLikes[post._id] && (
                <div className="usercoop-forumlist-comments">
                  <h3>❤️ Likes</h3>
                  {post.likes?.length > 0 ? (
                    post.likes.map((like) => (
                      <div key={like._id} className="forumlist-coop-comment-item">
                        <div className="forumlist-coop-comment-content flex">
                          {like.user?.image && (
                            <img src={like.user.image?.url || "default-user.png"} alt="User" className="comment-avatar" />
                          )}
                          <p>
                            <strong>{like.user?.firstName} {like.user?.lastName}</strong>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No likes yet.</p>
                  )}
                </div>
              )}


              <div className="usercoop-forumlist-crud-actions">
                <button className="usercoop-forumlist-edit-btn " onClick={() => openEditModal(post)}>Edit</button>
                <button className="usercoop-forumlist-delete-btn" onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          )) }
        </div>
      </div>

      {isCreateModalOpen && <ForumCreate closeModal={() => setIsCreateModalOpen(false)} />}
      {isEditModalOpen && <ForumUpdate closeModal={() => setIsEditModalOpen(false)} post={selectedPost} />}
    </div>
  );
};

export default ForumPostList;