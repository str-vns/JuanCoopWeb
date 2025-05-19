import React, { useState } from 'react';
import "@assets/css/tutorial.css";
import Navbar from "../layout/navbar";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Tutorial = () => {
  const videos = [
    { id: "Zuanhh_BLX8", title: "Website Community Discussion" },
    { id: "UWNQQ8r7Upg", title: "Add reviews" },
    { id: "Tmv6TkTERak", title: "Placing an Order" },
    { id: "K583VdD5xIU", title: "Search and Product filtering" },
    { id: "cxK5EebSJIs", title: "Navigation of User Dashboard" },
    { id: "oeWZ3pKyDpQ", title: "Create User account" },

     { id: "MW6j7VXs4dw", title: "Rating and Review list" },
    { id: "HRc5yjoVaGE", title: "Wallet and Payment" },
    { id: "KXoLvCRjZWI", title: "Update order status" },
    { id: "CQCBT8Sz58A", title: "Managing Product and Inventory" },
    { id: "IiHLCRZyReg", title: "Cooperative Dashboard" },
    { id: "Qi7-5HM6SOY", title: "Rider Management" },
    { id: "Y9X1ti4Dgl4", title: "Membership Application" },
    { id: "pAWqrzcobmI", title: "Blogs and Discussion" },
    // Add more videos if needed
  ];

  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollX, setScrollX] = useState(0);

  const filteredVideos = videos.filter(video => {
    const title = video.title.toLowerCase();
    return searchTerm
      .toLowerCase()
      .split(" ")
      .every(word => title.includes(word));
  });

  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 300;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="yt-page">
      <Navbar />
      <div className="tutorial-content">
      <aside className="video-sidebar">
  <h3>Video List</h3>
  
  <input
    type="text"
    placeholder="Search videos..."
    className="search-bar"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <ul>
    {filteredVideos.map((video, index) => (
      <li
        key={index}
        className={video.id === currentVideo.id ? 'active' : ''}
        onClick={() => setCurrentVideo(video)}
      >
        {video.title}
      </li>
    ))}
  </ul>
</aside>

  
        <main className="video-main">
          <div className="main-video">
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.id}`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <h2 className="main-title">{currentVideo.title}</h2>
          </div>
  
          {/* <input
            type="text"
            placeholder="Search videos..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
  
  <div className="video-carousel-container">
  <button className="scroll-button left" onClick={() => scroll('left')}>
    <FaChevronLeft />
  </button>

  <div className="video-list scrollable" ref={scrollContainerRef}>
    {filteredVideos.map((video, index) => (
      <div
        key={index}
        className={`video-thumb ${video.id === currentVideo.id ? 'active' : ''}`}
        onClick={() => setCurrentVideo(video)}
      >
        <img
          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
        />
        <div className="thumb-info">
          <p>{video.title}</p>
        </div>
      </div>
    ))}
  </div>

  <button className="scroll-button right" onClick={() => scroll('right')}>
    <FaChevronRight />
  </button>
</div>

        </main>
      </div>
    </div>
  );
  
  
};

export default Tutorial;
