import React from "react";
import Navbar from "./navbar";
import logo from "../../assets/img/logo.png";
import one from "../../assets/img/one.jpg";
import two from "../../assets/img/two.jpg";
import three from "../../assets/img/three.jpg";
import four from "../../assets/img/four.jpg";
import five from "../../assets/img/five.jpg";
import six from "../../assets/img/six.jpg";
import seven from "../../assets/img/seven.jpg";
import eight from "../../assets/img/eight.jpg";
import nine from "../../assets/img/nine.jpg";
import a from "../../assets/img/a.jpg";
import b from "../../assets/img/b.jpg"; 
import c from "../../assets/img/c.jpg";
import d from "../../assets/img/d.jpg";
import e from "../../assets/img/e.jpg";
import f from "../../assets/img/f.jpg";
import g from "../../assets/img/g.jpg";
import h from "../../assets/img/h.jpg";
import i from "../../assets/img/i.jpg";   
import j from "../../assets/img/j.jpg";
import melgie from "../../assets/img/melgie.jpg";
import stevens from "../../assets/img/stevens.jpg";
import alexandra from "../../assets/img/alex.jpg";
import princess from "../../assets/img/princess.jpg";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const services = [
  {
    title: "Online Payment & COD",
    desc: "Flexible payment options, including secure online transactions and cash on delivery (COD).",
    img: "https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/1_c7n4dv.png",
  },
  {
    title: "Real-Time Product Tracking",
    desc: "Track products in real-time from dispatch to delivery for transparency and trust.",
    img: "https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/3_pv0cmm.png",
  },
  {
    title: "Product Listing & Management",
    desc: "Showcase and manage products easily in our digital marketplace.",
    img: "https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/4_v8uox7.png",
  },
  {
    title: "Reviews with Sentiment Analysis",
    desc: "Understand customer feedback with sentiment analysis to improve services.",
    img: "https://res.cloudinary.com/dgcitse7c/image/upload/v1746167517/5_ontrp2.png",
  },
  {
    title: "Community Forum",
    desc: "Collaborate and share knowledge in our cooperative community forum.",
    img: "https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/6_ampffm.png",
  },
  {
    title: "Data-Driven Insights",
    desc: "Analytics and reports for better business decisions and growth.",
    img: "https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/2_egsec0.png",
  },
];

const LandingPage = () => {
  // Slider settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024, // tablet and smaller screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative w-full h-[500px] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dgcitse7c/image/upload/v1746167524/cover2_acunkl.png')",
        }}
        aria-label="Hero section with platform tagline"
      >
        <div className="bg-black bg-opacity-50 p-6 rounded-md max-w-xl mx-4">
          <img
            src={logo}
            alt="JuanKooP Logo"
            className="mx-auto w-28 mb-6 drop-shadow-lg"
          />
          <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
            JuanKooP
          </h1>
          <p className="text-white text-lg md:text-xl mb-6 drop-shadow-md">
            Empowering Cooperatives, <br />
            Uniting communities for development
          </p>
          <Link
            to="/home"
            className="inline-block px-8 py-3 bg-[#c8a876] hover:bg-[#c09858] text-white font-bold rounded-full shadow-lg transition"
          >
            Show More
          </Link>
        </div>
      </section>
       {/* Featured Product Teaser Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-green-700">Featured Product Teaser</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/1WZ4CEtPixc?start=10"
                title="Featured Product Teaser"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-80"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      
      {/* How We Built This Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-700">How We Built This</h2>
          <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto">
            JuanKooP was built using modern web technologies such as React, Node.js, and cloud services. Our team collaborated closely with local cooperatives to ensure the platform meets real-world needs, focusing on transparency, accessibility, and community empowerment.
          </p>
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            arrows={true}
            responsive={[
              {
                breakpoint: 1024,
                settings: { slidesToShow: 2, slidesToScroll: 1, dots: true },
              },
              {
                breakpoint: 640,
                settings: { slidesToShow: 1, slidesToScroll: 1, dots: true },
              },
            ]}
            className="max-w-4xl mx-auto"
          >
            <div>
              <img
                src={one}
                alt="Development Process"
                className="mx-auto w-60 h-60 object-contain rounded shadow mb-4"
              />
              {/* <p className="text-gray-600 text-sm">Cloud-based analytics and reporting</p> */}
            </div>
            <div>
              <img
                src={two}
                alt="Product Management"
                className="mx-auto w-60 h-60 object-contain rounded shadow mb-4"
              />
              {/* <p className="text-gray-600 text-sm">Modern product management tools</p> */}
            </div>
            <div>
              <img
                src={three}
                alt="Payment Integration"
                className="mx-auto w-60 h-60 object-contain rounded shadow mb-4"
              />
              {/* <p className="text-gray-600 text-sm">Secure payment integration</p> */}
            </div>
            <div>
              <img
                src={four}
                alt="Tracking"
                className="mx-auto w-60 h-60 object-contain rounded shadow mb-4"
              />
              {/* <p className="text-gray-600 text-sm">Real-time product tracking</p> */}
            </div>
            <div>
              <img
                src={five}
                alt="Sentiment Analysis"
                className="mx-auto w-60 h-60 object-contain rounded shadow mb-4"
              />
              {/* <p className="text-gray-600 text-sm">Customer feedback & sentiment analysis</p> */}
            </div>
            <div>
              <img
                src={six}
                alt="Community Forum"
                className="mx-auto w-60 h-60 object-contain rounded shadow mb-4"
              />
              {/* <p className="text-gray-600 text-sm">Community collaboration tools</p> */}
            </div>
            <div>
              <img
                src={seven}
                alt="Community Forum"
                className="mx-auto w-60 h-60 object-contain rounded shadow mb-4"
              />
              {/* <p className="text-gray-600 text-sm">Community collaboration tools</p> */}
            </div>
            <div>
              <img
                src={eight}
                alt="Community Forum"
                className="mx-auto w-60 h-60 object-contain rounded shadow mb-4"
              />
              {/* <p className="text-gray-600 text-sm">Community collaboration tools</p> */}
            </div>
            <div>
              <img
                src={nine}
                alt="Community Forum"
                className="mx-auto w-60 h-60 object-contain rounded shadow mb-4"
              />
              {/* <p className="text-gray-600 text-sm">Community collaboration tools</p> */}
            </div>
          </Slider>
        </div>
      </section>

{/* Meet the Creators Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10 text-green-700">Meet the Creators</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {/* Example creator card */}
                        <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
                            <img
                                src={alexandra}
                                alt="Alexandra Aquino"
                                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-green-200"
                            />
                            <h3 className="text-lg font-semibold mb-1">Alexandra Aquino</h3>
                            {/* <p className="text-gray-600 text-sm text-center">Lead Developer & Cooperative Advocate</p> */}
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
                            <img
                                src={melgie}
                                alt="Melgie Balongcas"
                                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-green-200"
                            />
                            <h3 className="text-lg font-semibold mb-1">Melgie Balongcas</h3>
                            {/* <p className="text-gray-600 text-sm text-center">UI/UX Designer & Community Builder</p> */}
                        </div>
                <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
                            <img
                                src={stevens}
                                alt="Steven Barrantes"
                                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-green-200"
                            />
                            <h3 className="text-lg font-semibold mb-1">Steven Barrantes</h3>
                            {/* <p className="text-gray-600 text-sm text-center">Lead Developer & Cooperative Advocate</p> */}
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
                            <img
                                src={princess}
                                alt="Princess Romero"
                                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-green-200"
                            />
                            <h3 className="text-lg font-semibold mb-1">Princess Romero</h3>
                            {/* <p className="text-gray-600 text-sm text-center">UI/UX Designer & Community Builder</p> */}
                        </div>
                        {/* Add more creators as needed */}
                    </div>
                </div>
            </section>


{/* Participating Cooperatives Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10 text-green-700">Participating Cooperatives</h2>
                    <div className="flex flex-wrap justify-center gap-8">
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={c}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">Abangan Multipurpose Cooperative</h3>
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={a}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">Catmon Multipurpose Cooperative</h3>
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={d}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">Gabay Kaunlaran ng Bulacan Multipurpose Cooperative</h3>
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={h}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">Kooperatibang Pangkabuhayan ng Sta. Maria</h3>
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={b}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">Mag Asawang Sapa MPC</h3>
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={j}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">Mahabang Parang Waterworks Cooperative</h3>
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={e}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">San Miguel de Marilao Multipurpose Cooperative</h3>
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={i}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">Silangan Multipurpose Cooperative</h3>
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={f}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">Sto. Niño De Parada Multipurpose Cooperative</h3>
  </div>
  <div className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
    <img
      src={g}
      alt="AgriCoop Farmers"
      className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-green-200"
    />
    <h3 className="text-lg font-semibold mb-1">Vitarich Employees Cooperative Association</h3>
  </div>
</div>

                </div>
            </section>

      {/* Services Section with Carousel */}
      {/* <section id="services" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Our Services
          </h2>

          <Slider {...settings}>
            {services.map(({ title, desc, img }, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col mx-2"
                style={{ height: "320px" }}
              >
                <img
                  src={img}
                  alt={title}
                  className="w-full h-24 object-contain p-4"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-700 text-sm flex-grow">{desc}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section> */}

      {/* Call to Action */}
      <section
        id="contactUs"
        className="py-12 bg-[#c8a876] text-white text-center"
        aria-label="Contact Us Section"
      >
        <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Cooperative?</h2>
        <p className="mb-6 max-w-xl mx-auto text-lg">
          Get in touch with us today and learn how JuanKooP can help empower your
          cooperative and community.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-4 bg-white text-[#c8a876] font-semibold rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Register Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-white-900 text-black-300 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img src={logo} alt="JuanKooP Logo" className="w-24" />
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} JuanKooP. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" aria-label="Facebook" className="hover:text-black">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 16.99 22 12z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-black">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14.86 4.48 4.48 0 0 0-7.86 4.1A12.94 12.94 0 0 1 3 4.67 4.48 4.48 0 0 0 4.52 11a4.41 4.41 0 0 1-2.04-.56v.06a4.48 4.48 0 0 0 3.6 4.4 4.52 4.52 0 0 1-2.03.08 4.48 4.48 0 0 0 4.18 3.12A9 9 0 0 1 2 19.54 12.73 12.73 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.18 8.18 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;