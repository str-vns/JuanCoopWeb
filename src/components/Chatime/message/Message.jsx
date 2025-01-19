import React, { useState, useEffect } from 'react';
import { format } from 'timeago.js';
import axios from 'axios';
import './message.css';
import  {getToken} from "@utils/helpers";
import ImageModal from './ImageModal';
import { useDispatch, useSelector } from "react-redux";
import baseUrl from "@Commons/baseUrl";
const Message = ({ message, own, conversation, currentUser }) => {
  
  const token = getToken();
  const [friend, setFriend] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

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

  const openModal = (index) => {
    setSelectedImageIndex(index); 
  };

  const closeModal = () => {
    setSelectedImageIndex(null); 
  };
  
  return (
<div className={own ? 'message own' : 'message'}>
      <div className="messageTop">

        {own ? null :  <img
          className="messageImg"
          src={ (friend ? friend.image.url : '')}
          alt=""
        /> }
       
        <p className="messageText">
          {message.decryptedText ? message.decryptedText : message.text}
        </p>
      </div>
      <div className="messageBottom bg-text text-black">
  {format(message.createdAt)}
</div>

      {/* {selectedImageIndex !== null && (
        <ImageModal image={message.images[selectedImageIndex]} closeModal={closeModal} />
      )} */}
    </div>
  );
};

export default Message;