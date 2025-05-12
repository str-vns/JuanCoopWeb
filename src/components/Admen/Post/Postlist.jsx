import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, approvePost, deletePost } from '@src/redux/Actions/postActions';
import Sidebar from "../sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostList = () => {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post) || {};
  const { loading = false, posts = [] } = postState;

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('notApproved');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalAction, setModalAction] = useState(null); // Track the action (approve/decline)
  const [selectedPostId, setSelectedPostId] = useState(null); // Track the selected post ID
  const postsPerPage = 8;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const unapprovedPosts = posts.filter((post) => post.status !== 'approved');
  const approvedPosts = posts.filter((post) => post.status === 'approved');
  const displayedPosts = activeTab === 'notApproved' ? unapprovedPosts : approvedPosts;
  const currentPosts = displayedPosts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    dispatch(getPost());
  }, [dispatch]);

  const handleApprove = async () => {
    if (selectedPostId) {
      await dispatch(approvePost(selectedPostId));
      dispatch(getPost()); // Reload posts
      setIsModalOpen(false); // Close the modal
      toast.success("Post approved successfully!"); // Show success toast
    }
  };

  const handleDecline = async () => {
    if (selectedPostId) {
      await dispatch(deletePost(selectedPostId));
      dispatch(getPost()); // Reload posts
      setIsModalOpen(false); // Close the modal
      toast.success("Post deleted successfully!"); // Show success toast
    }
  };

  const openConfirmationModal = (postId, action) => {
    setSelectedPostId(postId);
    setModalAction(action);
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.tabContainer}>
        <button
          className={`tabButton ${activeTab === 'notApproved' ? 'activeTab' : ''}`}
          onClick={() => setActiveTab('notApproved')}
        >
          <span className={activeTab === 'notApproved' ? 'activeTabText' : 'tabText'}>Not Approved</span>
        </button>
        <button
          className={`tabButton ${activeTab === 'approved' ? 'activeTab' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          <span className={activeTab === 'approved' ? 'activeTabText' : 'tabText'}>Approved</span>
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingIndicator}><span>Loading...</span></div>
      ) : displayedPosts.length > 0 ? (
        <div style={styles.postsContainer}>
          {currentPosts.map((post) => (
            <div key={post._id} style={styles.postCard}>
              <div style={styles.imageAndContent}>
                <img
                  src={post.image?.[0]?.url || 'path/to/placeholder/image.png'}
                  alt="Post"
                  style={styles.postImage}
                />
                <div style={styles.postDetails}>
                  <p style={styles.postContent}>{post.content || 'No content available'}</p>
                  <p style={styles.postDate}>Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {activeTab === 'notApproved' && (
                <div style={styles.buttonContainer}>
                  <button
                    style={styles.approveButton}
                    onClick={() => openConfirmationModal(post._id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    style={styles.declineButton}
                    onClick={() => openConfirmationModal(post._id, 'decline')}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noPostsText}>No posts available.</p>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ fontWeight: "bold" }}>Confirmation</h3>
            <p>
              Are you sure you want to{' '}
              {modalAction === 'approve' ? 'approve' : 'decline'} this post?
            </p>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                style={
                  modalAction === 'approve'
                    ? styles.confirmApproveButton
                    : styles.confirmDeclineButton
                }
                onClick={
                  modalAction === 'approve' ? handleApprove : handleDecline
                }
              >
                {modalAction === 'approve' ? 'Approve' : 'Decline'}
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

const styles = {
  container: {
    padding: '15px',
    backgroundColor: '#FFFFFF',
    marginLeft: '250px',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    display: 'flex',
  },
  tabContainer: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  loadingIndicator: { textAlign: 'center' },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '15px',
    border: '1px solid #E0E0E0',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '700px',
  },
  imageAndContent: { display: 'flex', alignItems: 'center', flex: 1 },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  approveButton: {
    padding: '10px 15px',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  declineButton: {
    padding: '10px 15px',
    borderRadius: '5px',
    backgroundColor: '#F44336',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  postImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    marginRight: '16px',
    backgroundColor: '#F0F0F0',
  },
  postDetails: { flex: 1 },
  postContent: { fontSize: '16px', fontWeight: 'bold', color: '#333' },
  postDate: { fontSize: '14px', color: '#777' },
  noPostsText: { fontSize: '18px', color: '#555', textAlign: 'center', marginTop: '25px' },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: '300px',
  },
  modalActions: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  confirmApproveButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  confirmDeclineButton: {
    padding: '10px 20px',
    backgroundColor: '#F44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default PostList;