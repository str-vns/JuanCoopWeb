import React, { useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import { FaSearch, FaReply, FaThumbsUp, FaComment } from "react-icons/fa";
import "../css/coopprofile.css";
import ForumPost from "./ForumPost";

const ForumList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("post");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [threads, setThreads] = useState([
    {
      id: 1,
      title: "How to Improve Your Productivity",
      postCount: 5,
      lastPost: "User1",
      date: "Dec 18, 2024",
      excerpt: "Learn the best strategies for managing time and staying productive...",
      likes: 2,
      liked: false,
      comments: [
        { id: 1, user: "User2", content: "Great tips! I'll definitely try these!" },
        { id: 2, user: "User3", content: "Thanks for the advice!" },
      ],
      newComment: "",
    },
    {
      id: 2,
      title: "React for Beginners",
      postCount: 3,
      lastPost: "User2",
      date: "Dec 15, 2024",
      excerpt: "A beginner's guide to building dynamic web applications using React.js...",
      likes: 5,
      liked: false,
      comments: [
        { id: 1, user: "User1", content: "This helped me get started with React!" },
      ],
      newComment: "",
    },
    {
      id: 3,
      title: "Mastering Tailwind CSS",
      postCount: 7,
      lastPost: "User3",
      date: "Dec 10, 2024",
      excerpt: "How to design responsive websites effortlessly with Tailwind CSS...",
      likes: 10,
      liked: false,
      comments: [],
      newComment: "",
    },
  ]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLikeToggle = (id) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? { ...thread, liked: !thread.liked, likes: thread.liked ? thread.likes - 1 : thread.likes + 1 }
          : thread
      )
    );
  };

  const handleCommentChange = (id, event) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id ? { ...thread, newComment: event.target.value } : thread
      )
    );
  };

  const handleCommentSubmit = (id) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              comments: [
                ...thread.comments,
                { id: thread.comments.length + 1, user: "User4", content: thread.newComment },
              ],
              newComment: "",
            }
          : thread
      )
    );
  };

  const handleOpenModal = () => {
    setModalAction("post"); // Set the modal to 'post' action
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreatePost = (newPost) => {
    const newThread = {
      id: threads.length + 1,
      title: newPost.title,
      postCount: 0,
      lastPost: "You",
      date: new Date().toLocaleDateString(),
      excerpt: newPost.content.substring(0, 100) + "...",
      comments: [],
    };
    setThreads((prevThreads) => [newThread, ...prevThreads]);
  };

  const handleButtonClickPostList = () => {
    window.location.href = "/forumpostlist";
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
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
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-500" />
            </div>
            <div className="ml-auto flex gap-x-2">
              <button
                className="bg-yellow-300 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none w-auto"
                onClick={handleOpenModal} // Open modal when clicked
              >
                Add Post
              </button>
              <button
                className="bg-yellow-300 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none w-auto"
                onClick={handleButtonClickPostList}
              >
                My Post
              </button>
            </div>
          </div>

          {/* Threads Listing */}
          <div className="space-y-4">
            {threads
              .filter((thread) =>
                thread.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((thread) => (
                <div
                  key={thread.id}
                  className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="card-body p-6">
                    <h2 className="card-title text-xl font-semibold">{thread.title}</h2>
                    <p className="text-sm text-gray-500">
                      {thread.date} | {thread.postCount} posts | Last post by {thread.lastPost}
                    </p>
                    <p className="mt-2 text-gray-600">{thread.excerpt}</p>
                    {/* Add a Comment Section */}
                    <div className="flex items-center space-x-4 mt-4">
                      {/* Like Button */}
                      <button
                        className={`btn btn-ghost ${thread.liked ? "text-blue-500" : "text-gray-500"}`}
                        onClick={() => handleLikeToggle(thread.id)}
                      >
                        <FaThumbsUp className="mr-2" />
                        {thread.likes}
                      </button>

                      {/* Comment Button */}
                      <button
                        onClick={() => {} /* Handle comment click */}
                        className="btn btn-ghost text-gray-500"
                      >
                        <FaComment className="mr-2" />
                      </button>

                      {/* Comment Textarea */}
                      <textarea
                        value={thread.newComment}
                        onChange={(e) => handleCommentChange(thread.id, e)}
                        className="textarea textarea-bordered w-full mt-2"
                        placeholder="Add a comment..."
                      ></textarea>

                      {/* Post Comment Button */}
                      <button
                        onClick={() => handleCommentSubmit(thread.id)}
                        className="btn btn-primary mt-2"
                      >
                        <FaComment className="mr-2" />
                      </button>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg">Comments</h3>
                      {thread.comments.length > 0 ? (
                        <div className="space-y-2">
                          {thread.comments.map((comment) => (
                            <div key={comment.id} className="text-gray-700">
                              <strong>{comment.user}:</strong> {comment.content}
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