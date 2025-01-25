import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedPosts, likePost } from "@src/redux/Actions/postActions";
import Header from "../header";
import Sidebar from "../sidebar";
import { FaSearch, FaThumbsUp, FaComment } from "react-icons/fa";
import "../css/coopprofile.css";
import ForumPost from "./ForumPost";
import AuthGlobal from "@redux/Store/AuthGlobal";

const ForumList = () => {
  const dispatch = useDispatch();
  const { stateUser } = useContext(AuthGlobal);
  const userId = stateUser?.userProfile?._id;
  const [comments, setComments] = useState({});
  const { posts, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchApprovedPosts()); // Fetch posts when the component mounts
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(likePost(postId, userId)); // Dispatch like action
    dispatch(fetchApprovedPosts()); // Re-fetch posts to reflect updated like count
  };

  const handleCommentChange = (postId, value) => {
    setComments({
      ...comments,
      [postId]: value,
    });
  };

  const handleCommentSubmit = (postId) => {
    const comment = comments[postId];
    if (comment) {
      console.log(`Comment on Post ${postId}: ${comment}`);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreatePost = (newPost) => {
    const newThread = {
      id: posts.length + 1,
      title: newPost.title,
      postCount: 0,
      lastPost: "You",
      date: new Date().toLocaleDateString(),
      excerpt: newPost.content.substring(0, 100) + "...",
      comments: [],
    };
    dispatch(fetchApprovedPosts()); // Re-fetch posts after creating new post
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <span>Loading posts...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <Header />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Search Bar */}
          <div className="flex items-center mb-4 gap-x-2">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search threads..."
                className="input input-bordered w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-500" />
            </div>
            <div className="ml-auto flex gap-x-2">
              <button
                className="bg-yellow-300 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={handleOpenModal}
              >
                Add Post
              </button>
            </div>
          </div>

          {/* Posts Listing */}
          <div className="space-y-4">
            {posts
              .filter((post) =>
                post.content.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((post) => (
                <div key={post._id} className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="card-body p-6">
                    <h2 className="card-title text-xl font-semibold">{post.content}</h2>
                    <p className="text-sm text-gray-500">
                      {post.date} | {post.likeCount} likes | Last post by {post.author?.firstName}
                    </p>
                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(post._id)}
                      className="btn btn-ghost text-gray-500"
                    >
                      <FaThumbsUp className="mr-2" />
                      {post.likeCount}
                    </button>

                    {/* Comment Section */}
                    <textarea
                      value={comments[post._id] || ""}
                      onChange={(e) => handleCommentChange(post._id, e.target.value)}
                      className="textarea textarea-bordered w-full mt-2"
                      placeholder="Add a comment..."
                    ></textarea>

                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      className="btn btn-primary mt-2"
                    >
                      <FaComment className="mr-2" />
                    </button>

                    {/* Display Comments */}
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg">Comments</h3>
                      {post.comment.length > 0 ? (
                        <div className="space-y-2">
                          {post.comment.map((comment) => (
                            <div key={comment._id} className="text-gray-700">
                              <strong>{comment.firstName}:</strong> {comment.comment}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No comments yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal for Creating Post */}
      <ForumPost
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
};

export default ForumList;