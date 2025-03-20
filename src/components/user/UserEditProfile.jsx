import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthGlobal from '@redux/Store/AuthGlobal';
import { Profileuser, ProfileEdit } from '@redux/Actions/userActions';
import { useSocket } from '../../../SocketIo';
import '@assets/css/userEditProfile.css';

const UserEditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const socket = useSocket();
  const { user } = useSelector((state) => state.userOnly);
  const userId = context?.stateUser?.userProfile?._id;

  useEffect(() => {
    if (user) {
      setFirstName(user?.firstName || '');
      setLastName(user?.lastName || '');
      setPhoneNumber(user?.phoneNum || '');
      setGender(user?.gender || '');
      setImagePreview(user?.image?.url || '');
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('profileUpdated', (updatedUserProfile) => {
        console.log('Profile updated:', updatedUserProfile);
        dispatch(Profileuser(userId, updatedUserProfile));
      });

      return () => {
        socket.off('profileUpdated');
      };
    }
  }, [socket, dispatch, userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!firstName || !lastName || !phoneNumber) {
      setErrors('Please fill all fields');
      return;
    }

    if (phoneNumber.length !== 11) {
      setErrors('Phone number must be 11 digits');
      return;
    }

    const editProfile = {
      firstName,
      lastName,
      phoneNumber,
      gender,
      image,
    };

    dispatch(ProfileEdit(userId, editProfile));

    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  return (
    <div className="containerprofile">
      <div className="header">
        <button className="drawerButton" onClick={() => navigate(-1)}>
          &#9776;
        </button>
        <h1 className="headerTitle">Update Profile</h1>
      </div>

      <div className="profilePicContainer">
        {imagePreview ? (
          <img src={imagePreview} alt="Profile" className="profilePic" />
        ) : (
          <img src="/default-profile.png" alt="Default" className="profilePic" />
        )}
        <button className="updateText" onClick={() => setModalVisible(true)}>
          Update Profile Picture
        </button>
      </div>

      <div className="inputContainer">
        <label className="label">Edit First Name</label>
        <input
          type="text"
          className="input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label className="label">Edit Last Name</label>
        <input
          type="text"
          className="input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label className="label">Edit Phone Number</label>
        <input
          type="text"
          className="input"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <label className="label">Edit Gender</label>
        <select
          className="input"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="prefer not to say">Prefer Not To Say</option>
        </select>

        {errors && <div className="error">{errors}</div>}

        <button className="button" onClick={handleSave}>
          Save & Update
        </button>
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modalContent">
            <h2>Choose an option to get an image:</h2>
            <div className="buttonRow">
              <label className="fileInputLabel">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                Upload Image
              </label>
              <button
                className="cancelButton"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEditProfile;
