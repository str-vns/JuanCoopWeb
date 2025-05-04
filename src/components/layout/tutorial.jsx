import React, { useState } from 'react';
import "@assets/css/tutorial.css";
import Navbar from "../layout/navbar";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Tutorial = () => {
  const videos = [
    { id: "ognBjIx28JY", title: "Managing Your Coop Profile and Settings" },
    { id: "nMQ2i94TUtI", title: "How to Leave Feedback on Coop Products and Sellers" },
    { id: "l6mobZ2vSgU", title: "Joining Conversations in the Coop Forum" },
    { id: "YSFNpktR7uY", title: "Exploring the User Dashboard" },
    { id: "AJb6H_fUM08", title: "How to Find Products Easily on Coop" },
    { id: "77W48qHKPrk", title: "Step-by-Step Guide: Buying Products on Coop" },
    // Add more videos if needed
  ];

  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollX, setScrollX] = useState(0);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
