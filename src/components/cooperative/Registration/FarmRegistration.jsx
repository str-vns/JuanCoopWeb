import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/navbar";
import "@assets/css/farmRegistration.css";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getToken } from "@utils/helpers";
import { reverseCode, forwardCode } from "@redux/Actions/locationActions";
import { registerCoop } from "@redux/Actions/coopActions";
import Map, { Marker } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibre from "maplibre-gl";
import Modal from "react-modal";

Modal.setAppElement("#root");

const FarmRegistration = () => {
  const dispatch = useDispatch();
  const user = getCurrentUser();
  const token = getToken();
  const navigate = useNavigate();
  const { GeoLoading, location, GeoError } = useSelector(
    (state) => state.Geolocation
  );
  const [viewState, setViewState] = useState({
    longitude: 120.9842,
    latitude: 14.5995,
    zoom: 13,
  });
  const [markerPosition, setMarkerPosition] = useState({
    longitude: 120.9842,
    latitude: 14.5995,
  });
  const [coopName, setCoopName] = useState("");
  const [myAddress, setMyAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [images, setImages] = useState([]);
  const [tinNumber, setTinNumber] = useState("");
  const [businessPermit, setBusinessPermit] = useState([]);
  const [corCDA, setCorCDA] = useState([]);
  const [orgStructure, setOrgStructure] = useState([]);

  const handleSave = (e) => {
    e.preventDefault();
    if (
      !myAddress ||
      !barangay ||
      !city ||
      !postalCode ||
      !latitude ||
      !longitude ||
      !coopName ||
      imagesPreview.length === 0 ||
      !businessPermit ||
      !corCDA ||
      !orgStructure
    ) {
      alert("Please fill in all fields");
      return;
    } else {
      const data = {
        farmName: coopName,
        address: myAddress,
        barangay: barangay,
        city: city,
        postalCode: postalCode,
        latitude: latitude,
        longitude: longitude,
        image: images,
        user: user._id,
        tinNumber: tinNumber,
        businessPermit: businessPermit,
        corCDA: corCDA,
        orgStructures: orgStructure,
      };

      dispatch(registerCoop(data, token));
      setMyAddress("");
      setBarangay("");
      setCity("");
      setPostalCode("");
      setLatitude("");
      setLongitude("");
      setCoopName("");
      setImagesPreview([]);
      setImages([]);
      setBusinessPermit(null);
      setCorCDA(null);
      setOrgStructure(null);
      navigate("/");
    }
  };

  const handleMarkerDragEnd = (event) => {
    const { lngLat } = event;
    setMarkerPosition({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
    });
    //  dispatch(reverseCode(lngLat.lat, lngLat.lng));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ latitude, longitude });
          setViewState((prevState) => ({
            ...prevState,
            latitude,
            longitude,
          }));
          dispatch(reverseCode(latitude, longitude));
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      setMyAddress(location?.address?.label);
      setLatitude(location?.position?.lat);
      setLongitude(location?.position?.lng);
      setBarangay(location?.address?.district);
      setCity(location?.address?.city);
      setPostalCode(location?.address?.postalCode);
    }
  }, [location]);

  const handleSearchClick = () => {
    if (searchQuery) {
      dispatch(forwardCode(searchQuery));
      setIsModalVisible(true);
    }
  };

  const handleSelectAddress = (result) => {
    setMarkerPosition({
      longitude: result?.position?.lng,
      latitude: result?.position?.lat,
    });

    setViewState((prevState) => ({
      ...prevState,
      longitude: result?.position?.lng,
      latitude: result?.position?.lat,
    }));
    setMyAddress(result?.address?.label);
    setLatitude(result?.position?.lat);
    setLongitude(result?.position?.lng);
    setBarangay(result?.address?.district);
    setCity(result?.address?.city);
    setPostalCode(result?.address?.postalCode);
    setSearchQuery("");
    setIsModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...Array.from(e.target.files)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onBusinessPermitChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setBusinessPermit((oldArray) => [...Array.from(e.target.files)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onCorChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCorCDA((oldArray) => [...Array.from(e.target.files)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onOrgChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setOrgStructure((oldArray) => [...Array.from(e.target.files)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-white-50 mt-14">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Farm Registration
          </h2>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Coop Name</label>
                <input
                  type="text"
                  value={coopName}
                  onChange={(e) => setCoopName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Tin Number</label>
                <input
                  type="text"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Coop Address</label>
                <input
                  type="text"
                  value={myAddress}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Barangay</label>
                <input
                  type="text"
                  value={barangay}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
            </div>
            <div className="mt-6">
              <div className="form-group mt-3">
                <div className="custom-file">
                  <label className="block text-gray-700 mb-2">Image</label>
                  <input
                    type="file"
                    name="images"
                    className="custom-file-input hidden"
                    id="customFile"
                    accept="image/*"
                    onChange={onChange}
                    multiple
                  />
                  <div className="flex items-center">
                    <label
                      htmlFor="customFile"
                      className="px-4 py-2 border-2 border-black rounded-md cursor-pointer bg-white text-black hover:bg-black hover:text-white"
                    >
                      Choose Images
                    </label>
                  </div>
                </div>

                <div className="flex flex-row mb-2">
                  {imagesPreview.map((img, index) => (
                    <img
                      src={img}
                      key={index}
                      alt={`Preview ${index}`}
                      className="my-3 mr-2"
                      width="55"
                      height="52"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                style={{ width: "100%", height: "400px" }} // Make sure the height is defined
                mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${
                  import.meta.env.VITE_MAPLIBRE_TOKEN
                }`}
                mapLib={maplibre}
              >
                <Marker
                  longitude={markerPosition.longitude}
                  latitude={markerPosition.latitude}
                  anchor="bottom"
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                >
                  <div
                    style={{
                      color: "blue",
                      fontSize: "24px",
                      cursor: "grab",
                    }}
                    title="Drag me to move"
                  >
                    📍
                  </div>
                </Marker>
              </Map>

              <div className="search-container-register">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Address"
                  className="search-bar"
                />
                <button onClick={handleSearchClick} className="search-btn">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-2">
                Upload Business Permit
              </label>
              <input
                type="file"
                name="businessPermit"
                onChange={onBusinessPermitChange}
                className="w-full border border-gray-300 p-2 rounded-md text-black"
                accept=".pdf,.doc,.docx"
              />
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-2">
                Upload COR File
              </label>
              <input
                type="file"
                name="corCDA"
                onChange={onCorChange}
                className="w-full border border-gray-300 p-2 rounded-md text-black"
                accept=".pdf,.doc,.docx"
              />
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-2">
                Organization Structure File
              </label>
              <input
                type="file"
                name="orgStructure"
                onChange={onOrgChange}
                className="w-full border border-gray-300 p-2 rounded-md text-black"
                accept=".pdf,.doc,.docx"
              />
            </div>

            <div className="farmRegisterBtn">
              <button type="submit" className="farmRegister">
                Register
              </button>
            </div>
          </form>

          {isModalVisible && (
            <Modal
              isOpen={isModalVisible}
              onRequestClose={handleCloseModal}
              style={{
                content: {
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                  width: "40%", // Adjusted width
                  height: "60%", // Adjusted height
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  overflowY: "auto", // Enable vertical scrolling
                },
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <h2 className="text-black text-center font-bold text-xl mb-4">
                Search Results
              </h2>
              <ul className="space-y-4">
                {Array.isArray(location) && location.length > 0 ? (
                  location.map((result, index) => (
                    <li
                      key={index}
                      className="p-4 border border-gray-300 rounded-md shadow-sm"
                    >
                      <p className="text-black font-medium">
                        {result?.address?.label}
                      </p>
                      <p className="text-black">{result?.address?.district}</p>
                      <p className="text-black">{result?.address?.city}</p>
                      <p className="text-black">
                        {result?.address?.postalCode}
                      </p>
                      <button
                        onClick={() => handleSelectAddress(result)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Select Address
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-black text-center">No addresses found.</p>
                )}
              </ul>
              <div className="text-center mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmRegistration;
