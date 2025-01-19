import React from "react";

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    // Replace with your OAuth logic or redirect URL
    console.log("Google Login Clicked");
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth";
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Google Login</h2>
        <p className="text-gray-600 mb-4">
          Sign in to your account using your Google credentials.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 focus:outline-none"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default GoogleLogin;