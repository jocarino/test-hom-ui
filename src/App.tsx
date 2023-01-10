import React from 'react';
import arrow from './arrow-symbol.png';
import './App.css';
import MapHomePage from './map/mapHomePage';
import { Helmet } from 'react-helmet';
import 'leaflet/dist/leaflet.css'

function App() {
  return (
    <>
      {/* <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet> */}
      <MapHomePage />
    </>
  );

}

export default App;
