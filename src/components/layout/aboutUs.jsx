import React from "react";
import "@assets/css/aboutUs.css";
import Navbar from "../layout/navbar";
import "../../assets/img/1.png";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div class="relative w-full h-[500px] pt-8" id="home">
        <div class="absolute inset-0 opacity-100">
          <img
            src="https://res.cloudinary.com/dgcitse7c/image/upload/v1746167524/cover2_acunkl.png"
            alt="Background Image"
            class="object-cover object-center w-full h-full"
          />
        </div>

        <div class="absolute inset-x-9 top-1/4 flex flex-col md:flex-row items-center justify-between opacity-100">
          {/* <div class="md:w-1/2 mb-4 md:mb-0">
      <h1 class="text-gray-700 font-medium text-4xl md:text-5xl leading-tight mb-2">
       JuanKoop
      </h1>
      <p class="font-regular text-xl mb-8 mt-4">
       Empowering Cooperatives, <br></br>Uniting communities for development
      </p>
      <a
        href="#contactUs"
        class="px-6 py-3 bg-[#c8a876] text-white font-medium rounded-full hover:bg-[#c09858] transition duration-200"
      >
        Contact Us
      </a>
    </div> */}
        </div>
      </div>

      <section class="py-10" id="services">
        <div className="w-full ml-0 mr-0 pl-0 pr-0">
          <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Services
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/1_c7n4dv.png"
                class="w-full h-64 object-cover"
              />
              <div class="p-6 text-center">
                <h3 class="text-xl font-medium text-gray-800 mb-2">
                  Online Payment & COD
                </h3>
                <p class="text-gray-700 text-base">
                  We offer flexible payment options, including secure online
                  transactions and cash on delivery (COD). This ensures
                  convenience for both cooperatives and customers, making
                  transactions smoother and more accessible.
                </p>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/3_pv0cmm.png"
                alt="Coffee"
                class="w-full h-64 object-cover"
              />
              <div class="p-6 text-center">
                <h3 class="text-xl font-medium text-gray-800 mb-2">
                  Real-Time Product Tracking
                </h3>
                <p class="text-gray-700 text-base">
                  Our platform enables real-time tracking of products, allowing
                  cooperatives and buyers to monitor orders from dispatch to
                  delivery. This transparency helps build trust and ensures
                  timely fulfillment of purchases.
                </p>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/4_v8uox7.png"
                alt="Coffee"
                class="w-full h-64 object-cover"
              />
              <div class="p-6 text-center">
                <h3 class="text-xl font-medium text-gray-800 mb-2">
                  Product Listing & Management
                </h3>
                <p class="text-gray-700 text-base">
                  Cooperatives can easily showcase their products through our
                  digital marketplace. The platform allows for seamless product
                  management, making it easier to update listings, track
                  inventory, and reach more customers.
                </p>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgcitse7c/image/upload/v1746167517/5_ontrp2.png"
                alt="Coffee"
                class="w-full h-64 object-cover"
              />
              <div class="p-6 text-center">
                <h3 class="text-xl font-medium text-gray-800 mb-2">
                  Reviews with Sentiment Analysis
                </h3>
                <p class="text-gray-700 text-base">
                  Customer reviews play a vital role in improving services. Our
                  sentiment analysis feature helps cooperatives understand
                  customer feedback, allowing them to enhance their products and
                  services based on real insights.
                </p>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/6_ampffm.png"
                alt="Coffee"
                class="w-full h-64 object-cover"
              />
              <div class="p-6 text-center">
                <h3 class="text-xl font-medium text-gray-800 mb-2">
                  Community Forum
                </h3>
                <p class="text-gray-700 text-base">
                  JuanKooP fosters collaboration through a community forum where
                  cooperatives can exchange knowledge, share experiences, and
                  discuss industry trends. This space encourages meaningful
                  conversations that strengthen cooperative networks.
                </p>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgcitse7c/image/upload/v1746167518/2_egsec0.png"
                alt="papad"
                class="w-full h-64 object-cover"
              />
              <div class="p-6 text-center">
                <h3 class="text-xl font-medium text-gray-800 mb-2">
                  Data-Driven Insights
                </h3>
                <p class="text-gray-700 text-base">
                  We provide cooperatives with analytics and reports that offer
                  valuable business insights. These data-driven tools help in
                  decision-making, improving efficiency, and identifying
                  opportunities for growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white-100" id="aboutus">
        <div class="w-full ml-5 mr-0 pl-0 pr-10 pt-10 pb-10">
          <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div class="max-w-lg">
              <h2 class="text-3xl font-bold text-white-800 mb-8 text-center">
                About Us
              </h2>
              <p class="mt-4 text-white-600 text-lg">
                JuanKooP is a platform designed to support cooperatives in
                Bulacan by providing a digital space where they can connect,
                collaborate, and grow. Our goal is to make it easier for
                cooperatives to manage their products, reach more customers, and
                improve their operations through accessible technology. With
                features like product listing, order management, real-time
                tracking, and a community forum, we aim to help cooperatives
                navigate the digital landscape while staying true to their
                values. Beyond this, JuanKooP envisions a collaborative space
                where cooperatives can work together, share resources, and
                create opportunities that indirectly empower local businesses
                and small and medium enterprises (SMEs). By fostering a strong
                cooperative network, we hope to contribute to a more sustainable
                and inclusive economy that benefits both cooperatives and the
                wider community.
              </p>
            </div>
            <div class="mt-12 md:mt-0">
              <img
                src="..\src\assets\img\2.png"
                alt="About Us Image"
                class="object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="text-gray-700 body-font mt-10">
        <div class="flex justify-center text-3xl font-bold text-gray-800 text-center ">
          Why Us?
        </div>
        <div class="w-full ml-0 mr-0 pl-0 pr-0">
          <div class="flex flex-wrap text-center justify-center">
            <div class="p-4 md:w-1/4 sm:w-1/2">
              <div class="px-4 py-6 transform transition duration-500 hover:scale-110">
                <div class="flex justify-center">
                  <img
                    src="https://image3.jdomni.in/banner/13062021/58/97/7C/E53960D1295621EFCB5B13F335_1623567851299.png?output-format=webp"
                    class="w-32 mb-3"
                  />
                </div>
                <h2 class="title-font font-regular text-2xl text-gray-900">
                  made for cooperatives
                </h2>
              </div>
            </div>

            <div class="p-4 md:w-1/4 sm:w-1/2">
              <div class="px-4 py-6 transform transition duration-500 hover:scale-110">
                <div class="flex justify-center">
                  <img
                    src="https://image2.jdomni.in/banner/13062021/3E/57/E8/1D6E23DD7E12571705CAC761E7_1623567977295.png?output-format=webp"
                    class="w-32 mb-3"
                  />
                </div>
                <h2 class="title-font font-regular text-2xl text-gray-900">
                  Easy-to-use platform
                </h2>
              </div>
            </div>

            <div class="p-4 md:w-1/4 sm:w-1/2">
              <div class="px-4 py-6 transform transition duration-500 hover:scale-110">
                <div class="flex justify-center">
                  <img
                    src="https://image3.jdomni.in/banner/13062021/16/7E/7E/5A9920439E52EF309F27B43EEB_1623568010437.png?output-format=webp"
                    class="w-32 mb-3"
                  />
                </div>
                <h2 class="title-font font-regular text-2xl text-gray-900">
                  Expands market reach
                </h2>
              </div>
            </div>

            <div class="p-4 md:w-1/4 sm:w-1/2">
              <div class="px-4 py-6 transform transition duration-500 hover:scale-110">
                <div class="flex justify-center">
                  <img
                    src="https://image3.jdomni.in/banner/13062021/EB/99/EE/8B46027500E987A5142ECC1CE1_1623567959360.png?output-format=webp"
                    class="w-32 mb-3"
                  />
                </div>
                <h2 class="title-font font-regular text-2xl text-gray-900">
                  Supports local businesses
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit us section */}
      <section className="bg-white-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl font-extrabold text-gray-900"
              id="contactUs"
            >
              Visit Our Location
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Let us serve you the best
            </p>
          </div>
          <div className="mt-8 lg:mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="max-w-full mx-auto rounded-lg overflow-hidden text-left">
                  {" "}
                  {/* Added text-left here */}
                  <div className="border-t border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-bold text-gray-900">Contact</h3>
                    <p className="mt-1 font-bold text-gray-600">
                      <a href="tel:+123">Phone: +91 123456789</a>
                    </p>
                    <a className="flex m-1" href="tel:+919823331842">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-start h-10 w-30 rounded-md bg-indigo-500 text-white p-2">
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                            />
                          </svg>
                          <span className="ml-2">Call now</span>{" "}
                          {/* Added margin-left to the text */}
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Our Address
                    </h3>
                    <p className="mt-1 text-gray-600">Santa Maria, Bulacan</p>
                  </div>
                  <div className="border-t border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900">Hours</h3>
                    <p className="mt-1 text-gray-600">
                      Monday - Sunday : 9am - 5pm
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden order-none sm:order-first">
                <div className="rounded-lg overflow-hidden order-none sm:order-first h-[450px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7722.39630681948!2d120.9561085966795!3d14.831821530810835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397a8de24b249b9%3A0x293b12e1dc8b9c98!2sSanta%20Maria%2C%20Bulacan!5e0!3m2!1sen!2sph!4v1741091451503!5m2!1sen!2sph"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
