import React, { useState } from 'react';

const Deomse = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Function to get the user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          setError("Error getting location: " + err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Function to send location to the Django API
  const checkLocationMatch = async () => {
    if (location.latitude && location.longitude) {
      try {
        const response = await fetch(
            `api_combined/get-data?latitude=${location.latitude}&longitude=${location.longitude}`,
           /* {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }*/
          );
          
          
        const data = await response.text();

        // Update the result based on the API response
        if (data.Errormsg) {
          setResult(data.Errormsg);
        } else {
          setResult("Location matches with the API location!");
        }
      } catch (err) {
        setError("Error connecting to the API: " + err.message);
      }
    } else {
      setError("Location not available. Please try again.");
    }
  };

  return (
    <div>
      <h1>Location Matcher</h1>
      <button onClick={getLocation}>Get My Location</button>
      {location.latitude && location.longitude && (
        <div>
          <p>Your Latitude: {location.latitude}</p>
          <p>Your Longitude: {location.longitude}</p>
          <button onClick={checkLocationMatch}>Check Location Match</button>
        </div>
      )}
      {result && <h3>{result}</h3>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Deomse;