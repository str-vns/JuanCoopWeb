import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from "@utils/helpers";
import { getUserPost, softDeletePost, restorePost, createPost, updatePost } from '@src/redux/Actions/postActions';
import { useNavigate } from 'react-router-dom';
import '@assets/css/coopuserforumlist.css';
import Sidebar from '../sidebar';

const ForumPostList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const { loading, posts } = useSelector((state) => state.post);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [postData, setPostData] = useState({ content: "", images: [] });
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(getUserPost(userId));
    }
  }, [userId, dispatch]);

  const handleSoftDelete = (postId) => {
    dispatch(softDeletePost(postId));
    alert("Post marked as deleted!");
  };

  const handleRestore = (postId) => {
    dispatch(restorePost(postId));
    alert("Post restored successfully!");
  };

  const openModal = (mode, post = null) => {
    setModalMode(mode);
    if (mode === "edit" && post) {
      setSelectedPostId(post._id);
      setPostData({ content: post.content, images: post.image || [] });
    } else {
      setSelectedPostId(null);
      setPostData({ content: "", images: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostData({ content: "", images: [] });
    setSelectedPostId(null);
  };

  const handleSubmit = () => {
    if (!postData.content.trim()) {
      alert("Content is required.");
      return;
    }

    const formData = new FormData();
    formData.append("content", postData.content);
    formData.append("author", userId);
    postData.images.forEach((image) => {
      formData.append("image", image);
    });

    if (modalMode === "edit" && selectedPostId) {
      dispatch(updatePost(selectedPostId, postData)).then(() => {
        alert("Post updated successfully!");
        dispatch(getUserPost(userId));
        closeModal();
      });
    } else {
      dispatch(createPost(formData)).then(() => {
        alert("Post created successfully!");
        dispatch(getUserPost(userId));
        closeModal();
      });
    }
  };

  return (
    <div className="forum-container">
      <Sidebar />

      {loading && <div className="forum-loading">Loading...</div>}

      <button className="forum-add-post-button" onClick={() => openModal("create")}>
        + Create New Post
      </button>

      <div className="forum-post-container">
        {posts?.length > 0 ? (
          [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (
            <div key={post._id} className="forum-post-card">
              <h2 className="forum-post-title">{post.title}</h2>
              <p className="forum-post-content">{post.content}</p>

              {post.image?.length > 0 && (
                <div className="forum-image-container">
                  {post.image.map((img, index) => (
                    <img key={index} src={img.url} alt="Post" className="forum-post-image" />
                  ))}
                </div>
              )}

              <div className="forum-action-buttons">
                {!post.isDeleted ? (
                  <>
                    <button className="forum-edit-button" onClick={() => openModal("edit", post)}>
                      Edit
                    </button>
                    <button className="forum-delete-button" onClick={() => handleSoftDelete(post._id)}>
                      Soft Delete
                    </button>
                  </>
                ) : (
                  <button className="forum-restore-button" onClick={() => handleRestore(post._id)}>
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="forum-no-posts">No posts available.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalMode === "edit" ? "Edit Post" : "Create Post"}</h2>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData({ ...postData, content: e.target.value })}
              placeholder="What's on your mind?"
              className="modal-textarea"
            ></textarea>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setPostData({ ...postData, images: files });
              }}
              className="modal-file-input"
            />

            <div className="modal-image-preview">
              {postData.images.length > 0 &&
                postData.images.map((img, index) => (
                  <img
                    key={index}
                    src={img instanceof File ? URL.createObjectURL(img) : img.url}
                    alt="Preview"
                    className="modal-preview-image"
                  />
                ))}
            </div>

            <button className="modal-submit-button" onClick={handleSubmit}>
              {modalMode === "edit" ? "Update Post" : "Create Post"}
            </button>
            <button className="modal-close-button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumPostList;