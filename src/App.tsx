import React, { useEffect, useState } from 'react';
import arrow from './arrow-symbol.png';
import './App.css';

function App() {
  // Global variables to store the device's current orientation and location
  var currentOrientation: any;
  var currentLocation: any;
  var arrowElement = document.getElementById('arrow')

  // The target GPS coordinates
  var targetCoordinates = {
    latitude: 37.785834,  // The target latitude
    longitude: -122.406417  // The target longitude
  };

  // function OrientationTracker() {
  //   const [orientation, setOrientation] = useState('');

  //   useEffect(() => {
  //     function handleOrientationChange() {
  //       setOrientation(window.screen.orientation.type);
  //     }

  //     window.addEventListener('orientationchange', handleOrientationChange);

  //     return () => {
  //       window.removeEventListener('orientationchange', handleOrientationChange);
  //     };
  //   }, []);

  //   return orientation
  // }

  // Initialize the device orientation and geolocation events
  window.addEventListener('deviceorientation', handleOrientationEvent);
  navigator.geolocation.watchPosition(handleGeolocationSuccess, handleGeolocationError);

  // Handle the deviceorientation event
  function handleOrientationEvent(event: any) {
    console.log('orientation event', event);

    // Store the device's current orientation
    currentOrientation = {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    };

    // Update the arrow orientation using the current orientation and location data
    updateArrowOrientation();
  }

  // Handle the geolocation success event
  function handleGeolocationSuccess(position: any) {
    // Store the device's current location
    currentLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    // Update the arrow orientation using the current orientation and location data
    updateArrowOrientation();
  }

  // Handle the geolocation error event
  function handleGeolocationError(error: any) {
    console.error('Error getting location', error);
  }

  // Calculate the angle between two sets of GPS coordinates
  function calculateAngle(coord1: any, coord2: any) {
    // Convert the coordinates to radians
    var lat1 = coord1.latitude * (Math.PI / 180);
    var lon1 = coord1.longitude * (Math.PI / 180);
    var lat2 = coord2.latitude * (Math.PI / 180);
    var lon2 = coord2.longitude * (Math.PI / 180);

    // Calculate the difference between the coordinates
    var dLon = lon2 - lon1;

    // Calculate the angle
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    var angle = Math.atan2(y, x)

    // Convert the angle from radians to degrees
    return angle * (180 / Math.PI);
  }

  // Update the orientation of the arrow
  function updateArrowOrientation() {
    // Check if we have both the current orientation and location data
    if (currentOrientation && currentLocation) {
      // Calculate the angle between the current location and the target coordinates
      var angle = calculateAngle(currentLocation, targetCoordinates);

      // Calculate the orientation of the arrow
      var arrowOrientation = angle - currentOrientation.alpha;
      console.log(arrowOrientation, currentOrientation, currentLocation);


      // Set the CSS transform of the arrow to rotate it to the calculated orientation
      if (arrowElement !== null) {
        arrowElement.style.transform = 'rotate(' + arrowOrientation + 'deg)';
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img id='arrow' src={arrow} className="App-logo" alt="logo" />
        <p>Orientation: {currentOrientation}, Location: {currentLocation}</p>
        {/*<a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );

}

export default App;
