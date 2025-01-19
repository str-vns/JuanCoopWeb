import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const CoopLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "user@example.com" && password === "password123") {
      navigate("/farmregistration");
    } else {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-50">
      {/* Left Section: Login Form */}
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 mb-2 text-left"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your email"
                value={email} // bind state
                onChange={(e) => setEmail(e.target.value)} // update state on input change
              />
            </div>

            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 mb-2 text-left"
              >
                Password
              </label>
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your password"
                value={password} // bind state
                onChange={(e) => setPassword(e.target.value)} // update state on input change
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-1 bottom-0.5 transform text-black-500 w-auto"
              >
                <FaEye className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-end mb-4">
              <a
                href="/forgotpassword"
                className="text-sm text-yellow-500 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <div className="text-center">
              <a
                href="/home"
                className="w-full inline-block px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-400 focus:outline-none text-center"
              >
                Sign In
              </a>
            </div>
          </form>

          <div className="my-6 flex items-center justify-center">
            <span className="text-gray-500">or</span>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <FcGoogle className="text-red-500" />
            <a
              href="/googlelogin"
              className="text-sm font-medium text-gray-700 hover:underline"
            >
              Login with Google
            </a>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-500">Don’t have an account? </span>
            <a href="/register" className="text-yellow-500 hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>

      {/* Right Section: Branding */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-[#fcef72] text-black p-10">
        <img
          src="../../../../public/images/logo.png"
          alt="Website Logo"
          className="w-80 h-70 mb-6"
        />
        <h3 className="text-4xl font-bold mb-4">Welcome to JuanCoop</h3>
        <p className="text-center text-lg leading-relaxed">
          Your one-stop shop for cooperative products and more. Experience
          hassle-free shopping today!
        </p>
      </div>
    </div>
  );
};

export default CoopLogin;
