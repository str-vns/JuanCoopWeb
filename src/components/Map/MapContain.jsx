import React, { useEffect, useState } from "react";
import Map, { Marker, Popup, NavigationControl, Source, Layer } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { allCoops } from "@redux/Actions/coopActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MapContain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { coops } = useSelector((state) => state.allofCoops);
  const [viewState, setViewState] = useState({
    longitude: -0.09,
    latitude: 51.505,
    zoom: 13,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCoop, setSelectedCoop] = useState(null);
  const [route, setRoute] = useState(null); 

  const handleMarkerClick = (coop) => {
    setSelectedCoop(coop); 
  };

  const handleViewProfile = () => {
    navigate(`/farmerprofile/${selectedCoop._id}`);
};
  const getRouteFromOSRM = async () => {
    if (!userLocation || !selectedCoop) return;

    const response = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${selectedCoop.longitude},${selectedCoop.latitude}?alternatives=true&overview=full&geometries=geojson`
    );
    const data = await response.json();
    console.log(data);
    setRoute(data.routes[0].geometry.coordinates); 
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setViewState((prevState) => ({
            ...prevState,
            latitude,
            longitude,
          }));
          dispatch(allCoops());
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, [dispatch]);

  useEffect(() => {
    if (userLocation && selectedCoop) {
      getRouteFromOSRM(); 
    }
  }, [userLocation, selectedCoop]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Map
        mapLib={import("maplibre-gl")}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPLIBRE_TOKEN}`}
      >
        {userLocation && (
          <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor="bottom">
            <div style={{ color: "blue", fontSize: "24px" }} className="fas">
              📍
            </div>
          </Marker>
        )}

        {coops && coops.map((coop, index) => (
          <Marker
            key={index}
            longitude={coop.longitude || coop[0]}
            latitude={coop.latitude || coop[1]}
            anchor="bottom"
            onClick={() => handleMarkerClick(coop)}
          >
            <div style={{ color: "red", fontSize: "24px" }} className="fas">
              📌
            </div>
          </Marker>
        ))}

        {selectedCoop && (
          <Popup
            longitude={selectedCoop.longitude}
            latitude={selectedCoop.latitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setSelectedCoop(null)}
            anchor="top"
          >
            <div>
              <h3>{selectedCoop.title}</h3>
              <img
                src={selectedCoop.image[0].url}
                alt={selectedCoop.title}
                style={{ width: "100%", height: "auto" }}
              />
              <p className="text-black mt-2 mb-2 font-bold">{selectedCoop.farmName}</p>
              <p className="text-black mt-2 mb-2">{selectedCoop.address}</p>
              <button onClick={handleViewProfile}>
            View more about {selectedCoop.farmName}
        </button>
            </div>
          </Popup>
        )}

        {route && (
          <Source
            id="route-source"
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: route.map(([lon, lat]) => [lon, lat]),
              },
            }}
          >
            <Layer
              id="route-layer"
              type="line"
              paint={{
                "line-color": "#0000FF",
                "line-width": 4,
              }}
            />
          </Source>
        )}

        <NavigationControl position="top-right" />

      </Map>
    </div>
  );
};

export default MapContain;