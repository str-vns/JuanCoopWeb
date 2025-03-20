import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Navbar from "../../layout/navbar";
import "@assets/css/farmRegistration.css";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getToken } from "@utils/helpers";
import { reverseCode, forwardCode } from "@redux/Actions/locationActions";
import { getSingleCoop } from "@redux/Actions/productActions";
import { deleteCoopImage, UpdateCoop } from "@redux/Actions/coopActions";
import Map, { Marker } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibre from "maplibre-gl";
import Modal from "react-modal";
import AuthGlobal from "@redux/Store/AuthGlobal";
import Sidebar from "../sidebar";

Modal.setAppElement("#root");

const EditFarm = () => {
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const token = getToken();
  const user = getCurrentUser();
  const navigate = useNavigate();
  const { GeoLoading, location, GeoError } = useSelector(
    (state) => state.Geolocation
  );
  const { coop, loading, error } = useSelector((state) => state.singleCoop);
  const farmId = coop?._id;
  console.log("Farm ID:", farmId); // Debugging

  // Get userInfo from context or Redux
  const userInfo = context.stateUser?.userProfile?._id || user?._id;

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

  // Fetch initial farm data
  useEffect(() => {
    if (userInfo) {
      dispatch(getSingleCoop(userInfo));
    }
  }, [userInfo, dispatch]);

  // Update state with fetched farm data
  useEffect(() => {
    if (coop && Object.keys(coop).length > 0) {
      setCoopName(coop.farmName || "");
      setMyAddress(coop.address || "");
      setBarangay(coop.barangay || "");
      setCity(coop.city || "");
      setPostalCode(coop.postalCode || "");
      setLatitude(coop.latitude || 14.5995);
      setLongitude(coop.longitude || 120.9842);
      setImagesPreview(coop.image || []);
      setMarkerPosition({
        longitude: coop.longitude || 120.9842,
        latitude: coop.latitude || 14.5995,
      });
      setViewState({
        longitude: coop.longitude || 120.9842,
        latitude: coop.latitude || 14.5995,
        zoom: 13,
      });
    }
  }, [coop]);

  // Handle marker drag end
  const handleMarkerDragEnd = (event) => {
    const { lngLat } = event;
    setMarkerPosition({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
    });
    setLatitude(lngLat.lat);
    setLongitude(lngLat.lng);
    dispatch(reverseCode(lngLat.lat, lngLat.lng));
  };

  // Handle image upload
  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]); // Clear previous previews
    setImages([]); // Clear previous images

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]); // Add data URL to preview
          setImages((oldArray) => [...oldArray, file]); // Add file to images array
        }
      };
      reader.readAsDataURL(file); // Read file as data URL
    });
  };
  console.log("Images Preview:", imagesPreview);

  // Handle delete image
  const deleteImage = (imageId, index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagesPreview((prevImages) => prevImages.filter((_, i) => i !== index));
    dispatch(deleteCoopImage(farmId, imageId));
  };

  // Handle form submission
  // Frontend: EditFarm.jsx
  const handleUpdate = (e) => {
    e.preventDefault();
    if (
      !myAddress ||
      !barangay ||
      !city ||
      !postalCode ||
      !latitude ||
      !longitude ||
      !coopName
    ) {
      alert("Please fill in all fields");
      return;
    } else {
      const data = {
        id: coop._id, // Ensure the ID is included
        farmName: coopName,
        address: myAddress,
        barangay: barangay,
        city: city,
        postalCode: postalCode,
        latitude: latitude,
        longitude: longitude,
        image: images, // Ensure this is an array of files
      };
  
      console.log("Data being sent to backend:", data); // Debugging
      console.log("Farm ID:", data.id); // Debugging
  
      dispatch(UpdateCoop(data, token))
        .then((response) => {
          console.log("Update response:", response); // Debugging
          navigate("/");
        })
        .catch((error) => {
          console.error("Error updating coop:", error); // Debugging
        });
    }
  };

  // Handle search for address
  const handleSearchClick = () => {
    if (searchQuery) {
      dispatch(forwardCode(searchQuery));
      setIsModalVisible(true);
    }
  };

  // Handle selecting an address from search results
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

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>Error: {error}</div>; // Show error state

  return (
    <>
      {/* <Navbar /> */}
      <Sidebar/>
      <div className="editFarmContainer">

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg ">
          {/* <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Edit Farm
          </h2> */}
          <div className="coop-list-header">
            <h1>Edit Farm</h1>
           
          </div>

          <form onSubmit={handleUpdate}>
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
                <label className="block text-gray-700 mb-2">Coop Address</label>
                <input
                  type="text"
                  value={myAddress}
                  onChange={(e) => setMyAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Barangay</label>
                <input
                  type="text"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                    <div key={index} className="relative">
                      <img
                        src={img.url} // Use the `url` property
                        alt={`Preview ${index}`}
                        className="my-3 mr-2"
                        width="55"
                        height="52"
                      />
                      <button
                        type="button"
                        onClick={() => deleteImage(img._id, index)} // Use the `_id` property
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                style={{ width: "100%", height: "400px" }}
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
                <button
                  type="button" // Add type="button" to prevent form submission
                  onClick={handleSearchClick}
                  className="search-btn"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>

            <div className="farmRegisterBtn">
              <button type="submit" className="farmRegister">
                Update
              </button>
            </div>
          </form>

          {isModalVisible && (
            <Modal isOpen={isModalVisible} onRequestClose={handleCloseModal}>
              <h2 className="text-black mt-10">Search Results</h2>
              <ul>
                {Array.isArray(location) && location.length > 0 ? (
                  location.map((result, index) => (
                    <li key={index}>
                      <p className="text-black">{result?.address?.label}</p>
                      <p className="text-black">{result?.address?.district}</p>
                      <p className="text-black">{result?.address?.city}</p>
                      <p className="text-black">
                        {result?.address?.postalCode}
                      </p>
                      <button onClick={() => handleSelectAddress(result)}>
                        Select Address
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-black">No addresses found.</p>
                )}
              </ul>
              <button onClick={handleCloseModal}>Close</button>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default EditFarm;