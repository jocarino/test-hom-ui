import './App.css';
import MapHomePage from './map/mapHomePage';
import 'leaflet/dist/leaflet.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import UploadPosterLocation from './map/uploadPosterLocation';
import PosterFeed from './poster/posterFeed';
import PosterCMSPage from './poster/admin/updatePoster';
import CreatePosterPage from './poster/admin/createPoster';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/"
            element={<MapHomePage />} />
          <Route path="/posters"
            element={<PosterFeed />} />
          <Route path='/upload/poster-location' element={<UploadPosterLocation />}></Route>
          <Route path="/admin/poster"
            element={<PosterCMSPage />} />
          <Route path="/admin/poster/new"
            element={<CreatePosterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );

}

export default App;
