import React, { useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import { FaSearch, FaReply, FaThumbsUp, FaComment } from "react-icons/fa"; // Added thumbs up and comment icons
import "../css/coopprofile.css"; // Assuming custom styles are here for your project

const ForumPostList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Sample thread data with like count and comments
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

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Search Bar */}
          <div className="flex items-center mb-4">
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
    </div>
  );
};

export default ForumPostList;