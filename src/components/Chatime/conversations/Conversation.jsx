import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
import  {getToken} from "@utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import baseUrl from "@Commons/baseUrl";
const Conversation = ({ conversation, currentUser, onlineUsers }) => {
  const dispatch = useDispatch()
  const token = getToken();
  const [friend, setFriend] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const imagine = "/images/Loogo.png";

  useEffect(() => {
    const friendId = conversation?.members?.find((m) => m !== currentUser?._id);
    
    const getUser = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        const res = await axios(`${baseUrl}user/${friendId}`, config );
        setFriend(res.data.details);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();

  }, [token, conversation, currentUser]);

  useEffect(() => {

   
    if (friend && onlineUsers.some(user => user.userId === friend.user._id && user.isOnline)) {
      setIsOnline(true);
    } else {
      setIsOnline(false);
    }
  }, [friend, onlineUsers]);

  return (
    <div className="conversation border border-gray rounded-2xl relative">
      {friend && (
        <>
          <img
            className="conversationImg"
            src={friend?.image?.url || imagine}
            alt=""
          />
          <div
            className="statusIndicator"
            style={{ backgroundColor: isOnline ? "green" : "red" }}
          ></div>
          <span className="conversationName">{friend?.firstName} {" "} {friend?.lastName}</span>
        </>
      )}
    </div>
  );
};

export default Conversation;