import React, { useState, useEffect } from 'react';

const LocationCheck = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [address, setAddress] = useState('Fetching address...');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [status, setStatus] = useState('Checking location...');
    const [showDirections, setShowDirections] = useState(false);
    const [isRadioDisabled, setIsRadioDisabled] = useState(true); // Initially disabled

    const apiKey = "AIzaSyCOWhjk4Qxz3spiNz2BKgmQqdrO2vE6YL0"; // Replace with your actual API key
    const locations = {
        hopes: { lat: 11.026315893948706, lng: 77.01886865153762 },
        hundredFt: { lat: 11.019751391388388, lng: 76.96291929715497 },
        kuniyamuthur: { lat: 10.962300680170221, lng: 76.95525099972032 }
    };
    const boundaryRadius = 50;

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setLatitude(lat);
                    setLongitude(lng);
                    getFormattedAddress(lat, lng);
                    setIsRadioDisabled(false); // Enable radio buttons after location is fetched
                },
                error => {
                    console.error("Error getting location:", error);
                    setStatus("⚠️ Unable to fetch location!");
                }
            );
        } else {
            setStatus("⚠️ Geolocation not supported!");
        }
    };

    const getFormattedAddress = (lat, lng) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "OK" && data.results.length > 0) {
                    setAddress(data.results[0].formatted_address);
                } else {
                    setAddress("Address not found!");
                }
            })
            .catch(error => {
                console.error("Error fetching address:", error);
                setAddress("Error fetching address!");
            });
    };

    const handleBranchSelection = (event) => {
        const branch = event.target.value;
        setSelectedLocation(locations[branch]);
        showMap(locations[branch]);
    };

    const showMap = (location) => {
        if (!location) {
            alert("Please select a location first!");
            return;
        }

        const userLocation = { lat: latitude, lng: longitude };
        const map = new window.google.maps.Map(document.getElementById("map"), {
            center: location,
            zoom: 17
        });

        new window.google.maps.Circle({
            strokeColor: "#008000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#008000",
            fillOpacity: 0.35,
            map,
            center: location,
            radius: boundaryRadius
        });

        new window.google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location"
        });

        checkInsideBoundary(latitude, longitude, location);
    };

    const checkInsideBoundary = (lat, lng, location) => {
        const distance = haversineDistance(lat, lng, location.lat, location.lng);

        if (distance <= boundaryRadius) {
            setStatus("✅ You are inside the selected location.");
            setShowDirections(false);
        } else {
            setStatus("❌ You are outside the selected location.");
            setShowDirections(true);
        }
    };

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const toRad = angle => (Math.PI / 180) * angle;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const openDirections = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${selectedLocation.lat},${selectedLocation.lng}&travelmode=walking`, "_blank");
    };

    return (
        <div>
            <h2>Your Current Location:</h2>
            <p>Latitude: {latitude}, Longitude: {longitude}</p>
            <h3>Formatted Address:</h3>
            <p>{address}</p>

            <h3>Select Your Branch Location:</h3>
            <div style={{ marginTop: "15px" }}>
                <label>
                    <input
                        type="radio"
                        name="branch"
                        value="hopes"
                        onChange={handleBranchSelection}
                        disabled={isRadioDisabled} // Disabled based on state
                    /> Hopes
                </label>
                <label style={{ marginLeft: "15px" }}>
                    <input
                        type="radio"
                        name="branch"
                        value="hundredFt"
                        onChange={handleBranchSelection}
                        disabled={isRadioDisabled} // Disabled based on state
                    /> 100ft
                </label>
                <label style={{ marginLeft: "15px" }}>
                    <input
                        type="radio"
                        name="branch"
                        value="kuniyamuthur"
                        onChange={handleBranchSelection}
                        disabled={isRadioDisabled} // Disabled based on state
                    /> Kuniyamuthur
                </label>
            </div>

            <h4 style={{ color: status.includes("✅") ? "green" : "red" }}>{status}</h4>
            {showDirections && (
                <button id="directions" onClick={openDirections}>🚀 Get Directions</button>
            )}
            <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
        </div>
    );
};

export default LocationCheck;