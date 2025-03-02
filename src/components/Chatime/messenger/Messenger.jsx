import React, { useState, useEffect, useRef } from "react";
import "./messager.css";
import { getCurrentUser, getToken } from '@utils/helpers';
import Conversation from "../conversations/Conversation";
import Message from "../message/Message";
import "@fortawesome/fontawesome-free/css/all.css";
import { useSocket } from "../../../../SocketIo";
import {listMessages} from "@redux/Actions/messageActions";
import { conversationList } from '@redux/Actions/converstationActions';
import baseURL from "@Commons/baseUrl";
import Navbar from "../../layout/navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Messenger = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const token = getToken();
  const user = getCurrentUser();
  const { loading, conversations } = useSelector((state) => state.converList);
  const { users } = useSelector((state) => state.getThemUser);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arriveMessage, setArriveMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    if (user?._id && token) {
      dispatch(conversationList(user._id, token));
    }
  }, [user?._id, token, dispatch]);

  useEffect(() => {
    // Make sure the socket connection is valid
    if (socket) {
      const handleNewMessage = (data) => {
        // Assuming you have an array of messages, we append the new message to the array
        setArriveMessage((prevMessages) => [
          ...prevMessages,
          {
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          },
        ]);
      };
  
      // Listen for incoming messages
      socket.on("getMessage", handleNewMessage);
  
      // Clean up the event listener when the component is unmounted or socket changes
      return () => {
        socket.off("getMessage", handleNewMessage);
      };
    }
  }, [socket]);

  useEffect(() => {
    arriveMessage &&
      currentChat?.members.includes(arriveMessage.sender) &&
      setMessages((prev) => [...prev, arriveMessage]);
  }, [arriveMessage, currentChat]);
  
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
  
    // Validate the new message
    if (newMessage === "" || newMessage === null) {
      return; // Stops execution if newMessage is either an empty string or null
    }
  
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };
  
    const receiverId = currentChat?.members.find(
      (member) => member !== user._id
    );
  
    // Ensure currentChat and receiverId are valid
    if (!currentChat || !receiverId) {
      console.log("No active chat or receiver!");
      return; // Exit the function without sending
    }
  
    // Emit the new message to the socket
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
  <Navbar />
  <div className="lg:grid flex overflow-y-scroll flex-grow mt-[60px]"> {/* Adjust for navbar height */}
  <div className="messenger w-full h-full flex">
    <div className="chatMenu border-l-2 border-black text-center p-4">

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

      <div className="chatBox border-t-2 border-r-2 border-b-2 border-white">
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
                  className="sendButton"
                  onClick={handleSubmit}
                >
                 <i class="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </>
          ) : (
            <span className="noConversationText">Open a conversation to start a chat.</span>
          )}
        </div>
      </div>
    </div>
  </div>
</section>
  );
};

export default Messenger;
