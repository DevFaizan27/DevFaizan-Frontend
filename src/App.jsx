import React, { useEffect, useState, useContext } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { AuthContext, AuthProvider } from './context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import Signup from './components/Signup';
import Login from './components/Login';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const center = {
  lat: 28.6139, // Default center (Delhi)
  lng: 77.209,
};

const App = () => {
  const { user, token } = useContext(AuthContext);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAjz90kCAlCesuB-Vwv7BJ4quJtsWNmGDE', // Replace with your Google Maps API key
    libraries,
  });

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!token) return;

    const socket = io('https://dev-faizan-backend.vercel.app/', {
      query: { token },
    });

    // Handle location updates received from server
    socket.on('locationBroadcast', (location) => {
      setMarkers((prevMarkers) => {
        const existingMarkerIndex = prevMarkers.findIndex(
          (marker) => marker.employeeId === location.employeeId
        );
        if (existingMarkerIndex !== -1) {
          const updatedMarkers = [...prevMarkers];
          updatedMarkers[existingMarkerIndex] = location;
          return updatedMarkers;
        } else {
          return [...prevMarkers, location];
        }
      });
    });

    return () => socket.disconnect();
  }, [token]);

  // Function to handle location updates and send to server
  const handleLocationUpdate = (position) => {
    const { latitude, longitude } = position.coords;

    axios.post(
      'https://dev-faizan-backend.vercel.app/location',
      { latitude, longitude },
      {
        headers: {
          'Content-Type': 'application/json',
          'auth-token':token,
        },
      }
    )
      .then(response => {
        console.log('Location update successful:', response.data);
        // Optionally handle success
      })
      .catch(error => {
        console.error('Error updating location:', error);
        // Optionally handle error
      });
  };

  useEffect(() => {
    if (navigator.geolocation && user) {
      // Watch for continuous location updates
      const watchId = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        (error) => {
          console.error(error);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [user]);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div>
      {!user ? (
        <div>
          <Signup />
          <Login />
        </div>
      ) : (
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center}>
          {markers.map((marker) => (
            <Marker
              key={marker._id} // Assuming marker has a unique identifier like _id
              position={{ lat: marker.latitude, lng: marker.longitude }}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
