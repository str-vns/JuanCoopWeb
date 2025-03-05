import React, { useEffect, useState } from 'react'
import Navbar from '../../components/layout/navbar'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { singleAddress,  updateAddress } from '@redux/Actions/addressActions'
import { getCurrentUser, getToken } from "@utils/helpers";
import { reverseCode, forwardCode } from "@redux/Actions/locationActions";
import Modal from "react-modal";
import Map, { Marker} from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@assets/css/address.css";

Modal.setAppElement('#root');

function addressUpdate() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const user = getCurrentUser()
  const token = getToken()
  const navigate = useNavigate()
  const addresses = useSelector((state) => state.addresses.data);
  const loading = useSelector((state) => state.addresses.loading);
  const error = useSelector((state) => state.addresses.error);
  const { GeoLoading, location, GeoError } = useSelector((state) => state.Geolocation);
  const [viewState, setViewState] = useState({ longitude: -0.09, latitude: 51.505, zoom: 13,});
  const [markerPosition, setMarkerPosition] = useState({ longitude: -74.006, latitude: 40.7128, });
  const [myAddress, setMyAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (id && token) {
      dispatch(singleAddress(id, token))
    }
  }, [dispatch, id, token]);
  
  useEffect(() => {
    if (addresses?.latitude && addresses?.longitude) {
      setMarkerPosition({
        latitude: addresses.latitude,
        longitude: addresses.longitude,
      });
  
      setViewState((prevState) => ({
        ...prevState,
        latitude: addresses.latitude,
        longitude: addresses.longitude,
      }));
  
      setMyAddress(addresses.address);
      setLatitude(addresses.latitude);
      setLongitude(addresses.longitude);
      setBarangay(addresses.barangay);
      setCity(addresses.city);
      setPostalCode(addresses.postalCode);
    } else {
      console.error("Invalid coordinates:", addresses);
    }
  }, [addresses]);
  
   const handleSave =(e) => {
      e.preventDefault();
      if(!myAddress || !barangay || !city || !postalCode || !latitude || !longitude) {
        alert("Please fill in all fields");
        return;
      } else 
      {const data = {
        address: myAddress,
        barangay: barangay,
        city: city,
        postalCode: postalCode,
        latitude: latitude,
        longitude: longitude,
      }
      dispatch(updateAddress(id, data, token));
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

     if (location) {
     setMyAddress( location?.address?.label);
     setLatitude(location?.position?.lat);
     setLongitude( location?.position?.lng);
     setBarangay( location?.address?.district);
     setCity( location?.address?.city);
     setPostalCode( location?.address?.postalCode);
     }
    };
  
  
  
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
          setIsModalVisible(false);  // Close the modal
        };
          

  return (
    <div className="register-signup-container mt-14 text-black">
      {/* Map Section */}
      <div className="imageR-section p-10 text-white">
        <Map
          mapLib={import("maplibre-gl")}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "400px" }}
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

        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Address"
            className="search-bar"
          />
          <button onClick={handleSearchClick} className="search-btn">
            Search
          </button>
        </div>
      </div>

      {/* Address Form Section */}
      <div className="addressR-signup-card">
        <h1 className="addressR-form-title">Edit Address</h1>
        <form onSubmit={handleSave} className="addressR-form">
          <div className="addressR-form-group">
            <label>Address</label>
            <input
              type="text"
              name="myAddress"
              value={myAddress}
              placeholder="Input Address Name"
              className="addressR-form-input text-black"
              required
              disabled
            />
          </div>
          <div className="addressR-form-group">
            <label>Barangay</label>
            <input
              type="text"
              name="barangay"
              value={barangay}
              placeholder="Input Barangay Name"
              className="addressR-form-input text-black"
              required
              disabled
            />
          </div>
          <div className="addressR-form-group">
            <label>City</label>
            <input
              type="text"
              name="City"
              value={city}
              placeholder="Input City"
              className="addressR-form-input text-black"
              required
              disabled
            />
          </div>
          <div className="addressR-form-group">
            <label>Postal Code</label>
            <input
              type="text"
              name="Postal Code"
              value={postalCode}
              placeholder="Input Postal Code"
              className="addressR-form-input text-black"
              required
              disabled
            />
          </div>
          <button type="submit" className="addressR-submit-btn">
            Update Address
          </button>
        </form>
      </div>

      {/* Modal Section */}
      {isModalVisible && (
     <Modal isOpen={isModalVisible} onRequestClose={handleCloseModal}>
       <h2 className='text-black mt-10'>Search Results</h2>
       <ul>
         {Array.isArray(location) && location.length > 0 ? (
           location.map((result, index) => (
             <li key={index}>
               <p className='text-black'>{result?.address?.label}</p>
               <p className='text-black'>{result?.address?.district}</p>
               <p className='text-black'>{result?.address?.city}</p>
               <p className='text-black'>{result?.address?.postalCode}</p>
               <button onClick={() => handleSelectAddress(result)}>Select Address</button>
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


)
}
export default addressUpdate;

