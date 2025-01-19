import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

const ChatOnline = ({ currentId, setCurrentChat, Friendy }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Filter out the current user from the members list
        const otherMembers = Friendy.members.filter(memberId => memberId !== currentId);

        // Fetch information of all other users in the conversation
        const promises = otherMembers.map(async (memberId) => {
          try {
            const res = await axios.get(`http://localhost:4000/api/v1/user/${memberId}`);
            return res.data;
          } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
          }
        });

        // Wait for all promises to resolve
        const users = await Promise.all(promises);
        
        // Filter out any null values (in case of error during fetching)
        const filteredUsers = users.filter(user => user !== null);
        
        setFriends(filteredUsers);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    if (Friendy && Friendy.members) {
      fetchFriends();
    }
  }, [currentId, Friendy]);

  return (
    <div className="chatOnline">
      {friends.map((friend) => (
        <div
          className="chatOnlineFriend"
          key={friend._id}
          onClick={() => setCurrentChat(friend)}
        >
          <div className="chatOnlineImgContainer">
            {/* Adjust the below line based on your data structure */}
            <img className="chatOnlineImg" src={friend.user.avatar.url} alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{friend.user.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;