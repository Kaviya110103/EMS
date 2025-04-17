import React, { useState, useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];
const apiKey = "AIzaSyCOWhjk4Qxz3spiNz2BKgmQqdrO2vE6YL0"; // Replace with your API Key

const LocationSelector = ({ onLocationStatusChange }) => {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey, libraries });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("Fetching address...");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Checking location...");
  const mapRef = useRef(null);

  const branchLocations = {
    hopes: { lat: 11.0263, lng: 77.0188 },
    hundredFt: { lat: 11.0197, lng: 76.9629 },
    kuniyamuthur: { lat: 10.9623, lng: 76.9552 }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          getFormattedAddress(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setStatusMessage("⚠️ Unable to fetch location!");
        }
      );
    } else {
      setStatusMessage("⚠️ Geolocation not supported!");
    }
  }, []);

  const getFormattedAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      setAddress(data.status === "OK" && data.results.length > 0 ? data.results[0].formatted_address : "Address not found!");
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address!");
    }
  };

  const handleBranchSelection = (event) => {
    setSelectedBranch(branchLocations[event.target.value]);
  };

  useEffect(() => {
    if (isLoaded && selectedBranch && latitude && longitude) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: selectedBranch,
        zoom: 17,
      });

      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: "Your Location",
      });

      new window.google.maps.Circle({
        strokeColor: "#008000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#008000",
        fillOpacity: 0.35,
        map,
        center: selectedBranch,
        radius: 50,
      });
      checkInsideBoundary(latitude, longitude);
    }
  }, [selectedBranch, isLoaded]);

  const checkInsideBoundary = (lat, lng) => {
    if (!selectedBranch) return;
    const distance = haversineDistance(lat, lng, selectedBranch.lat, selectedBranch.lng);
    const isInside = distance <= 50;
    setStatusMessage(isInside ? "✅ You are inside the selected location." : "❌ You are outside the selected location.");
    
    // Pass the status to the parent component
    if (onLocationStatusChange) {
      onLocationStatusChange(isInside);
    }
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRad = (angle) => (Math.PI / 180) * angle;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-start bg-white p-3 mb-4"
      style={{
        borderRadius: "10px",
        marginTop: "10px",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(8, 0, 0, 0.1)",
        maxWidth: "600px",
        width: "100%",
      }}
    >
      <div className="card shadow-sm p-3" style={{ width: "100%" }}>
        <p className="text-center mb-2" style={{ fontSize: "14px" }}>Your Current Location</p>
        <p className="text-center mb-2" style={{ fontSize: "12px" }}>{address}</p>

        <p className="text-center mb-2" style={{ fontSize: "14px" }}>Which is your designated branch?</p>
        <fieldset className="bg-light p-2 rounded mb-3">
          <div className="d-flex justify-content-around">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="branch" value="hopes" onChange={handleBranchSelection} id="hopes" />
              <label className="form-check-label" htmlFor="hopes" style={{ fontSize: "12px" }}>Hopes</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="branch" value="hundredFt" onChange={handleBranchSelection} id="hundredFt" />
              <label className="form-check-label" htmlFor="hundredFt" style={{ fontSize: "12px" }}>100ft</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="branch" value="kuniyamuthur" onChange={handleBranchSelection} id="kuniyamuthur" />
              <label className="form-check-label" htmlFor="kuniyamuthur" style={{ fontSize: "12px" }}>Kuniyamuthur</label>
            </div>
          </div>
        </fieldset>

        <h4 className="text-center mb-2" style={{ fontSize: "14px" }}>{statusMessage}</h4>
        {selectedBranch && (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${selectedBranch.lat},${selectedBranch.lng}&travelmode=walking`, "_blank")}
              style={{ fontSize: "12px" }}
            >
              � Get Directions
            </button>
          </div>
        )}

        <div ref={mapRef} className="mt-3" style={{ width: "100%", height: "300px", borderRadius: "8px" }}></div>
      </div>
    </div>
  );
};

export default LocationSelector;