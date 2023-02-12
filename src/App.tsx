import './App.css';
import MapHomePage from './map/mapHomePage';
import 'leaflet/dist/leaflet.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Poster from './poster/poster';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route  path="/" 
                  element={<MapHomePage />} />
          <Route  path="/poster" 
                  element={<Poster
                            title="posterTitle"
                            description="posterDescription"
                            imageSrc="monalisa"
                          />} />
        </Routes>
      </BrowserRouter>
    </>
  );

}

export default App;
