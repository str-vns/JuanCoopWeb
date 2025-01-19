import React, { useState } from "react";

const ForumPost = ({ isOpen, onClose, onCreatePost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = () => {
    if (title.trim() && content.trim()) {
      onCreatePost({ title, content });
      setTitle("");
      setContent("");
      onClose(); // Close the modal after creating the post
    } else {
      alert("Both fields are required.");
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            className="textarea textarea-bordered w-full"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here..."
          ></textarea>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreatePost}
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;