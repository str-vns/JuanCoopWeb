import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost, getUserPost } from '@src/redux/Actions/postActions';
import { getToken, getCurrentUser } from "@utils/helpers";
import '@assets/css/forumpostcreate.css';

const ForumCreate = ({ closeModal }) => {
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const token = getToken();
  const userId = currentUser?._id;
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [images, setImages] = useState([]);
//   const [postData, setPostData] = useState({ content: "", images: [] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent || (!imagesPreview.length && !images.length)) {
      alert("Please fill all the fields");
      return;
    }

    const data = {
      title: postTitle,
      content: postContent,
      image: images,
      author: userId,
    };

    console.log("Submitting post:", data);
    const response = await dispatch(createPost(data, token));
    if (response === true) {
      setTimeout(() => {
        window.location.reload();
        closeModal();
      }, 5000);
    }
    window.location.reload();
    closeModal();
    };
    
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
            setImagesPreview([]);
            setImages([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((prev) => [...prev, reader.result]);
                    setImages((prev) => [...prev, file]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="forumpost-create-overlay">
          <div className="forumpost-create-modal">
            <h2 className="forumpost-create-title">Create Post</h2>
    
            <form onSubmit={handleSubmit} className="forumpost-create-form">
              {/* Text Input */}
              <textarea
                className="forumpost-create-input"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Add Title"
              />
              <textarea
                className="forumpost-create-input"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
              />
              {/* Image Upload */}
              <div className="forumpost-create-images">
                <input
                  type="file"
                  name="images"
                  className="forumpost-create-file-input"
                  id="customFile"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                />
                <label htmlFor="customFile" className="forumpost-create-file-label">
                  Choose Images
                </label>
    
                {/* Image Preview */}
                <div className="forumpost-create-preview-container">
                  {imagesPreview.map((img, index) => (
                    <img src={img} key={index} alt={`Preview ${index}`} className="forumpost-create-preview" />
                  ))}
                </div>
              </div>
    
              {/* Buttons */}
              <div className="forumpost-create-buttons">
                <button className="forumpost-create-btn forumpost-create-primary" type="submit">
                  Create Post
                </button>
                <button className="forumpost-create-btn forumpost-create-cancel" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  };
export default ForumCreate;