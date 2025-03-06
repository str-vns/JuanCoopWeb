import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePost, imagePostDel } from "@src/redux/Actions/postActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import "@assets/css/forumpostupdate.css";

const ForumUpdate = ({ closeModal, post }) => {
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const postId = post._id;
  const token = getToken();

  const [postContent, setPostContent] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);  

  //const [postData, setPostData] = useState({ content: "", image: [] }); // Fixed field name to 'image'

  useEffect(() => {
    if (post) {
        setPostContent(post.content || "");
        setImagesPreview(post.image.map((img) => img.url) || []);
    }
  }, [post]);

  // Handle new image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prev) => [...prev, reader.result]);
          setImages((prev) => [...prev, file]);
          setNewImages((prev) => [...prev, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove an image
  const handleRemoveImage = (imageId, index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    dispatch(imagePostDel(postId, imageId));
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postContent || (!imagesPreview.length && !images.length)) {
      alert("Please fill all the fields");
      return;
    }

    const postData = {
      content: postContent,
      image: newImages,
    };

    console.log("Updating post:", postData);   
    const response = await dispatch(updatePost(post._id, postData, token));
    console.log("response", response);
    if (response === true) {
      setTimeout(() => {
        window.location.reload();
        closeModal();
      }, 5000);
    } 
    window.location.reload();
    closeModal();
};

return (
    <div className="forumpost-update-overlay">
      <div className="forumpost-update-modal">
        <h2 className="forumpost-update-title">Edit Post</h2>
        <form onSubmit={handleSubmit} className="forumpost-update-form">
          
          {/* Input Field */}
          <div className="forumpost-update-input-container">
            <input
              type="text"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
              placeholder="What's on your mind?"
              className="forumpost-update-input"
            />
          </div>

          {/* Image Upload Section */}
          <div className="forumpost-update-images">
            <input
              type="file"
              name="images"
              className="forumpost-update-file hidden"
              id="customFile"
              accept="image/*"
              onChange={handleImageChange}
              multiple
            />
            <label htmlFor="customFile" className="forumpost-update-label">
              Choose Images
            </label>

            <div className="forumpost-update-image-preview">
              {imagesPreview.length > 0 &&
                imagesPreview.map((img, index) => {
                  const imageId = post.image[index]?._id;
                  return (
                    <div key={imageId || index} className="forumpost-update-image">
                      <img src={img} alt={`Uploaded ${index}`} className="forumpost-update-img" />
                      <button
                        onClick={() => handleRemoveImage(imageId)}
                        className="forumpost-update-remove"
                      >
                        ✖
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Buttons */}
          <div className="forumpost-update-buttons">
            <button type="submit" className="forumpost-update-btn">
              Update Post
            </button>
            <button onClick={closeModal} className="forumpost-update-cancel">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ForumUpdate;