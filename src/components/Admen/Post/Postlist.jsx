import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, approvePost, deletePost } from '@src/redux/Actions/postActions';
import Sidebar from "../sidebar";

const PostList = () => {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post) || {};
  const { loading = false, posts = [] } = postState;

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Separate posts based on their status
  const unapprovedPosts = posts.filter((post) => post.status !== 'approved');
  const approvedPosts = posts.filter((post) => post.status === 'approved');

  // Slice for pagination (only for unapproved posts for now)
  const currentUnapprovedPosts = unapprovedPosts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    console.log('Dispatching getPost action');
    dispatch(getPost());
  }, [dispatch]);

  useEffect(() => {
    console.log('postState:', postState);
    console.log('posts:', posts);
  }, [postState, posts]);

  const handleApprove = async (postId) => {
    await dispatch(approvePost(postId));
    alert('Post Approved Successfully!');
    dispatch(getPost());
  };

  const handleDecline = async (postId) => {
    try {
      await dispatch(deletePost(postId));
      alert('Post deleted successfully!');
      dispatch(getPost());
    } catch (error) {
      await dispatch(deletePost(postId));
      alert('Post deleted successfully!');
      dispatch(getPost());
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(unapprovedPosts.length / postsPerPage);

  return (
    <div style={styles.container}>
      <Sidebar />
      {loading && (
        <div style={styles.loadingIndicator}>
          <span>Loading...</span>
        </div>
      )}
      {unapprovedPosts.length > 0 ? (
        <>
          <h2 style={styles.sectionTitle}>Unapproved Posts</h2>
          <div style={styles.postsContainer}>
            {currentUnapprovedPosts.map((post) => (
              <div key={post._id} style={styles.postCard}>
                <div style={styles.imageAndContent}>
                  <img
                    src={
                      post.image && post.image.length > 0
                        ? post.image[0].url
                        : 'path/to/placeholder/image.png'
                    }
                    alt="Post"
                    style={styles.postImage}
                  />
                  <div style={styles.postDetails}>
                    <p style={styles.postContent}>
                      {post.content || 'No content available'}
                    </p>
                    <p style={styles.postDate}>
                      Posted on: {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div style={styles.buttonContainer}>
                  <button
                    style={{ ...styles.button, ...styles.approveButton }}
                    onClick={() => handleApprove(post._id)}
                  >
                    Approve
                  </button>

                  <button
                    style={{ ...styles.button, ...styles.declineButton }}
                    onClick={() => handleDecline(post._id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.pagination}>
            <button
              style={{ ...styles.button, ...styles.paginationButton }}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
             <i class="fa-solid fa-arrow-left"></i>
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                style={{ ...styles.button, ...styles.paginationButton }}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              style={{ ...styles.button, ...styles.paginationButton }}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </>
      ) : (
        !loading && <p style={styles.noPostsText}>No unapproved posts available.</p>
      )}

      {approvedPosts.length > 0 && (
        <>
          <h2 style={styles.sectionTitle}>Approved Posts</h2>
          <div style={styles.postsContainer}>
            {approvedPosts.map((post) => (
              <div key={post._id} style={styles.postCard}>
                <div style={styles.imageAndContent}>
                  <img
                    src={
                      post.image && post.image.length > 0
                        ? post.image[0].url
                        : 'path/to/placeholder/image.png'
                    }
                    alt="Post"
                    style={styles.postImage}
                  />
                  <div style={styles.postDetails}>
                    <p style={styles.postContent}>
                      {post.content || 'No content available'}
                    </p>
                    <p style={styles.postDate}>
                      Posted on: {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

const styles = {
  container: {
    padding: '15px', // Adjusted padding for smaller layout
    backgroundColor: '#FFFFFF',
    marginLeft: '250px', // Adjust based on the width of your Sidebar
    overflow: 'hidden', // Remove scrollbar
  },
  loadingIndicator: {
    margin: '15px 0', // Smaller margin
    textAlign: 'center',
  },
  postsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px', // Adjusted gap
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px', // Reduced border radius
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Smaller shadow
    padding: '12px', // Reduced padding
    border: '1px solid #E0E0E0',
  },
  imageAndContent: {
    display: 'flex',
    alignItems: 'center',
  },
  postImage: {
    width: '60px', // Smaller image size
    height: '60px', // Smaller image size
    borderRadius: '8px',
    marginRight: '12px', // Smaller margin
    backgroundColor: '#F0F0F0',
  },
  postDetails: {
    flex: 1,
  },
  postContent: {
    fontSize: '14px', // Smaller text size
    fontWeight: '600',
    color: '#333',
    marginBottom: '6px', // Smaller margin
  },
  postDate: {
    fontSize: '12px', // Smaller font size
    color: '#777',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px', // Smaller margin
  },
  button: {
    flex: '0.48',
    padding: '8px', // Smaller padding
    borderRadius: '6px', // Reduced border radius
    border: 'none',
    cursor: 'pointer',
  },
  approveButton: {
    backgroundColor: '#f7b900',
    color: '#FFFFFF',
  },
  declineButton: {
    backgroundColor: '#F44336',
    color: '#FFFFFF',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px', // Smaller gap
    overflow: 'hidden', // Prevent scrollbar
    marginTop: '15px', // Smaller margin
    width:'200px',
  },
  paginationButton: {
 
    backgroundColor: '#C0C0C0',
    color: '#000000',
    fontSize: '12px', // Smaller text
    padding: '6px 12px', // Smaller padding
  },
  noPostsText: {
    fontSize: '16px', // Smaller font size
    color: '#555',
    textAlign: 'center',
    marginTop: '25px', // Smaller margin
  },
  sectionTitle: {
    fontSize: '18px', // Smaller title size
    fontWeight: '600',
    color: '#333',
    marginTop: '25px', // Smaller margin
    textAlign: 'center',
  },
};

export default PostList;
