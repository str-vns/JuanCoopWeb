import React from "react";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  return (
    <header className="header-container">
      {/* Left-side or center content (can add logo or title here if needed) */}
      <div className="header-content">
        <h1 className="header-title"></h1>
      </div>

      {/* Right-side icons */}
      <div className="header-icons">
        {/* Messages Icon */}
        <Link to="/messages">
          <button>
            <FaEnvelope size={20} />
            <span className="message-badge">3</span>
          </button>
        </Link>

        {/* Profile Icon */}
        <Link to="/coopprofileedit">
          <button>
            <FaUserCircle size={20} />
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;