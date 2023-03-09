import './App.css';
import MapHomePage from './map/mapHomePage';
import 'leaflet/dist/leaflet.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Poster from './poster/poster';
import UploadPosterLocation from './map/uploadPosterLocation';
import Login from './login/Login';
import { useStateValue } from './StateProvider';

function App() {
  const [{ user }] = useStateValue();
  console.log(user)
  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/"
              element={<MapHomePage />} />
            <Route path="/poster"
              element={<Poster
                title="posterTitle"
                description="posterDescription"
                imageSrc="monalisa"
              />} />
            <Route path='/upload/poster-location' element={<UploadPosterLocation />}></Route>
          </Routes>
        </BrowserRouter>
      )
      }
    </>
  );

}

export default App;
