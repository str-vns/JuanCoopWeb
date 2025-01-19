import React, { useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import '../css/coopprofile.css'

const CoopProfileEdit = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result); // Set the image preview URL
      };
      reader.readAsDataURL(file);
    }
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
          {/* Edit Profile Form */}
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form className="space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                
                <div className="flex w-auto items-center gap-4">
                  {/* Profile Picture Preview */}
                  <div className="w-auto h-24 overflow-hidden border">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Save and Cancel Buttons */}
              <div className="flex justify-center gap-4 ">
                <button type="button" className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoopProfileEdit;