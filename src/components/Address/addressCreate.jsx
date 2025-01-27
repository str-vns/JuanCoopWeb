import React, { useEffect, useState } from 'react'
import Navbar from '@components/layout/Navbar'
import { useDispatch, useSelector } from "react-redux";
import { reverseCode, forwardCode } from "@redux/Actions/locationActions";
import { addAddress } from '@src/redux/Actions/addressActions';
import { getCurrentUser, getToken } from "@utils/helpers";
import "@assets/css/addresscreate.css";
import Modal from "react-modal";
import Map, { Marker } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function AddressCreate() {
  const dispatch = useDispatch();
  const user = getCurrentUser();
  const token = getToken();
  const navigate = useNavigate();
  const { GeoLoading, location, GeoError } = useSelector((state) => state.Geolocation);
  const [viewState, setViewState] = useState({ longitude: -0.09, latitude: 51.505, zoom: 13 });
  const [markerPosition, setMarkerPosition] = useState({ longitude: -74.006, latitude: 40.7128 });
  const [myAddress, setMyAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    if (!myAddress || !barangay || !city || !postalCode || !latitude || !longitude) {
      alert("Please fill in all fields");
      return;
    } else {
      const data = {
        address: myAddress,
        barangay: barangay,
        city: city,
        postalCode: postalCode,
        latitude: latitude,
        longitude: longitude,
        userId: user._id,
      };
      dispatch(addAddress(data, token));
      setMyAddress("");
      setBarangay("");
      setCity("");
      setPostalCode("");
      setLatitude("");
      setLongitude("");
      navigate("/addressList");
    }
  }

  const handleMarkerDragEnd = (event) => {
    const { lngLat } = event;
    setMarkerPosition({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
    });
    dispatch(reverseCode(lngLat.lat, lngLat.lng));
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

  return (
    <div className="address-create-container">
      <Navbar />
      <div className="content-container mt-14">
        <div className="map-section p-10 rounded-lg shadow-lg">
          <Map
            mapLib={import("maplibre-gl")}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ width: "100%", height: "100%", borderRadius: "8px" }}
            mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPLIBRE_TOKEN}`}
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
          <div className="search-bar-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Address"
              className="search-bar"
              style={{ color: 'black' }}
            />
            <button onClick={handleSearchClick} className="search-btn">
              Search
            </button>
          </div>
        </div>
        <div className="address-form-container">
          <h1 className="form-title">Add Address</h1>
          <form onSubmit={handleSave} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="myAddress"
                  value={myAddress}
                  placeholder="Input Address Name"
                  className="form-input"
                  required
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Barangay</label>
                <input
                  type="text"
                  name="barangay"
                  value={barangay}
                  placeholder="Input Barangay Name"
                  className="form-input"
                  required
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="City"
                  value={city}
                  placeholder="Input City"
                  className="form-input"
                  required
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="Postal Code"
                  value={postalCode}
                  placeholder="Input Postal Code"
                  className="form-input"
                  required
                  disabled
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Add Address
            </button>
          </form>
        </div>
        {isModalVisible && (
          <Modal isOpen={isModalVisible} onRequestClose={handleCloseModal} className="modal">
            <h2 className="modal-title">Search Results</h2>
            <ul>
              {Array.isArray(location) && location.length > 0 ? (
                location.map((result, index) => (
                  <li key={index} className="modal-result">
                    <p>{result?.address?.label}</p>
                    <p>{result?.address?.district}</p>
                    <p>{result?.address?.city}</p>
                    <p>{result?.address?.postalCode}</p>
                    <button onClick={() => handleSelectAddress(result)} className="select-btn">
                      Select Address
                    </button>
                  </li>
                ))
              ) : (
                <p>No addresses found.</p>
              )}
            </ul>
            <button onClick={handleCloseModal} className="close-btn">
              Close
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default AddressCreate;