import React, { useState, useEffect, useRef } from "react";
import "./messager.css";
import { getCurrentUser, getToken } from '@utils/helpers';
import Conversation from "../conversations/Conversation";
import Message from "../message/Message";
import "@fortawesome/fontawesome-free/css/all.css";
import { useSocket } from "../../../../../SocketIo";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { conversationList } from '@redux/Actions/converstationActions';
import baseURL from "@Commons/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../sidebar";
import axios from "axios";

const Messenger = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const token = getToken();
  const user = getCurrentUser();
  const { loading, conversations } = useSelector((state) => state.converList);
  const { users } = useSelector((state) => state.getThemUser);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const scrollRef = useRef();

  
  useEffect(() => {
    if (socket && getCurrentUser()) {
      if (user?._id) {
        socket.emit("addUser", user._id);
      }
  
      const handleUsers = (users) => {
        console.log("users", users);
        const onlineUsers = users.filter(user => user.online && user?._id !== null);
        setOnlineUsers(onlineUsers);
      };
  
      socket.on("getUsers", handleUsers);
  

      return () => {
        socket.off("getUsers", handleUsers);
      };
    }
  }, [socket, user?._id]);

  useEffect(() => {
    if (user?._id && token) {
      dispatch(conversationList(user._id, token));
    }
  }, [user?._id, token, dispatch]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (data) => {
        const newMessage = {
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };
      socket.on("getMessage", handleNewMessage);
      return () => {
        socket.off("getMessage", handleNewMessage);
      };
    }
  }, [socket]);
  
  useEffect(() => {
    // Only fetch messages when currentChat is defined
    if (currentChat) {
      const fetchMessages = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          };
  
          const res = await axios.get(`${baseURL}m/${currentChat._id}`, config);
          setMessages(res.data.details); 
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
  
      fetchMessages(); // Call the async function
    }
  }, [currentChat, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newMessage === "" || newMessage === null) {
      return; 
    }
  
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };
  
    const receiverId = currentChat?.members.find(
      (member) => member !== user._id
    );
  
    if (!currentChat || !receiverId) {
      console.log("No active chat or receiver!");
      return; 
    }

    const isOnlinerUser = onlineUsers.find((user) => user.userId === receiverId);
    console.log("isOnlinerUser", isOnlinerUser);

    if (!isOnlinerUser) {
      const notification = {
        title: `New message`, 
        content: `You have a new message from ${user?.firstName} ${user?.lastName}`,
        user: receiverId,
        url: user?.image?.url,
        type: "message",
      }
      dispatch(sendNotifications(notification , token))
}


    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const res = await axios.post(`${baseURL}m`, message, config);
      const data = res.data.details.message;
      console.log("data", data);
      setMessages([...messages, res.data.details.message]);
      setNewMessage("");

    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
<section className="flex flex-col h-screen bg-white">
<Sidebar />
    <div className="messenger">
      <div className="chatMenu border-2 border-black text-center p-4">
        <h2 className="chatMenuHeader text-lg font-semibold mb-1">Active Chat List</h2>
        <div className="chatMenuWrapper">
          {conversations.map((c) => (
            <div key={c._id} onClick={() => setCurrentChat(c)}>
              <Conversation 
                conversation={c} 
                currentUser={user} 
                onlineUsers={onlineUsers} 
              />
            </div>
          ))}
        </div>
      </div>

      <div className="chatBox border-t-2 border-r-2 border-b-2 border-black">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop">
              {messages.map((m) => (
                  <div key={m._id} ref={scrollRef} >
                    <Message
                      message={m}
                      own={m.sender === user._id}
                      conversation={currentChat}
                      currentUser={user}
                    />
                  </div>
                ))}
              </div>

              <div className="chatBoxBottom border-t-2 pl-5">
                <textarea
                  className="chatMessageInput mt-2 rounded-lg border border-black align-top shadow-sm sm:text-sm text-black"
                  placeholder="Write something..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                ></textarea>

                <button
                  className="mt-3 inline-block rounded border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
                  onClick={handleSubmit}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <span className="noConversationText">Open a conversation to start a chat.</span>
          )}
        </div>
      </div>
    </div>
</section>
  );
};

export default Messenger;
