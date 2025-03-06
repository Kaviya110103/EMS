import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GeoLocationMap = ({ onLocationCheck }) => {
  const [locationStatus, setLocationStatus] = useState(""); // Track location status
  const centers = [
    { lat: 10.5575277, lng: 77.3621283 },
    { lat: 10.5574722, lng: 77.3621184 },
    { lat: 10.557638, lng: 77.3621459 },
  ];
  const sideLength = 5; // 5 meters
  const halfSide = sideLength / 2;

  const metersToDegrees = (meters) => meters / 111320;

  const getBounds = (center) => {
    const minLat = center.lat - metersToDegrees(halfSide);
    const maxLat = center.lat + metersToDegrees(halfSide);
    const minLng = center.lng - metersToDegrees(halfSide);
    const maxLng = center.lng + metersToDegrees(halfSide);
    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  };

  const isInsideAnySquare = (lat, lng) => {
    return centers.some((center) => {
      const bounds = getBounds(center);
      return (
        lat >= bounds[0][0] &&
        lat <= bounds[1][0] &&
        lng >= bounds[0][1] &&
        lng <= bounds[1][1]
      );
    });
  };

  const checkLocation = (position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const inside = isInsideAnySquare(userLat, userLng);

    // Update location status
    if (inside) {
      setLocationStatus("You are inside one of the three defined locations.");
    } else {
      setLocationStatus("You are NOT inside any of the three defined locations.");
    }

    onLocationCheck(inside);
  };

  useEffect(() => {
    // Create the map instance
    const map = L.map("map").setView([centers[0].lat, centers[0].lng], 18);

    // Add the tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add rectangles for the defined areas
    centers.forEach((center) => {
      const bounds = getBounds(center);
      L.rectangle(bounds, { color: "red", weight: 1 }).addTo(map);
    });

    // Check the user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(checkLocation, (error) => {
        console.error("Error getting location:", error);
        setLocationStatus("Error retrieving location.");
      });
    } else {
      setLocationStatus("Geolocation is not supported by your browser.");
    }

    // Cleanup function to remove the map instance
    return () => {
      map.remove(); // Properly destroy the map instance
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ height: "400px", width: "100%" }}></div>
      {/* Show location status */}
      <p style={{ marginTop: "20px", fontWeight: "bold" }}>{locationStatus}</p>
    </div>
  );
};

export default GeoLocationMap;
