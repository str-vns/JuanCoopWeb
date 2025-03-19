import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, approvePost, deletePost } from '@src/redux/Actions/postActions';
import Sidebar from "../sidebar";

const PostList = () => {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post) || {};
  const { loading = false, posts = [] } = postState;

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('notApproved');
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

  const handleApprove = async (postId) => {
    await dispatch(approvePost(postId));
    alert('Post Approved Successfully!');
    dispatch(getPost());
  };

  const handleDecline = (postId) => {
    dispatch(deletePost(postId)).then(() => {
      dispatch(getPost());
    });
    alert('Post deleted successfully!');
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
                <button style={styles.approveButton} onClick={() => handleApprove(post._id)}>Approve</button>
                <button style={styles.declineButton} onClick={() => handleDecline(post._id)}>Decline</button>
              </div>
            )}
          </div>
          
          ))}
        </div>
      ) : (
        <p style={styles.noPostsText}>No posts available.</p>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '15px', backgroundColor: '#FFFFFF', marginLeft: '250px',justifyContent: 'center',
    flexDirection: 'column', // Keeps them in a vertical column
    alignItems: 'center' , display: 'flex'},
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
    justifyContent: 'space-between', // Ensures content and buttons are spaced apart
    alignItems: 'center', // Aligns items vertically in the same row
    width: '700px',
  },
  imageAndContent: { display: 'flex', alignItems: 'center', flex: 1 },
  buttonContainer: {
    display: 'flex',
    gap: '10px', // Space between buttons
    justifyContent: 'flex-end', // Align buttons to the right
    flexShrink: 0, // Prevents buttons from shrinking
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
 
};



export default PostList;