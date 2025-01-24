import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, approvePost, deletePost } from '@src/redux/Actions/postActions';
import Sidebar from "@components/Admin/sidebar";

const PostList = () => {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post) || {};
  const { loading = false, posts = [] } = postState;

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

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

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div style={styles.container}>
      <Sidebar />
      {loading && (
        <div style={styles.loadingIndicator}>
          <span>Loading...</span>
        </div>
      )}
      {currentPosts && currentPosts.length > 0 ? (
        <>
          <div style={styles.postsContainer}>
            {currentPosts.map((post) => (
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
                {post.status !== 'approved' && (
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
                )}
              </div>
            ))}
          </div>
          <div style={styles.pagination}>
            <button
              style={{ ...styles.button, ...styles.paginationButton }}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
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
              Next
            </button>
          </div>
        </>
      ) : (
        !loading && <p style={styles.noPostsText}>No posts available.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
    marginLeft: '250px', // Adjust based on the width of your Sidebar
    overflow: 'hidden', // Remove scrollbar
  },
  loadingIndicator: {
    margin: '20px 0',
    textAlign: 'center',
  },
  postsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    border: '1px solid #E0E0E0',
  },
  imageAndContent: {
    display: 'flex',
    alignItems: 'center',
  },
  postImage: {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    marginRight: '15px',
    backgroundColor: '#F0F0F0',
  },
  postDetails: {
    flex: 1,
  },
  postContent: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  postDate: {
    fontSize: '14px',
    color: '#777',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  button: {
    flex: '0.48',
    padding: '12px',
    borderRadius: '8px',
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
    gap: '8px', /* Consistent spacing between buttons */
    overflow: 'hidden', /* Prevent scrollbar */
    marginTop: '20px',
  },
  paginationButton: {
    backgroundColor: '#333',
    color: '#FFFFFF',
  },
  noPostsText: {
    fontSize: '18px',
    color: '#555',
    textAlign: 'center',
    marginTop: '30px',
  },
};

export default PostList;
