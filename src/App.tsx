import './App.css';
import MapHomePage from './map/mapHomePage';
import 'leaflet/dist/leaflet.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Poster from './poster/poster';
import UploadPosterLocation from './map/uploadPosterLocation';
import Login from './login/Login';
import { useStateValue } from './context/StateProvider';
import { actionTypes } from './context/reducer';
import { UserCredential } from 'firebase/auth';
import { SessionStorage } from './common/constants';
import { useEffect } from 'react';
import Header from './header/Header';

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => { userUpdate() }, [user])

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/"
            element={<MapHomePage />} />
          <Route path="/poster"
            element={<Poster
              title="posterTitle"
              description="posterDescription"
              imageSrc="monalisa"
            />} />
          <Route path="/upload/poster-location"
            element={<UploadPosterLocation />} />
          <Route path="/login"
            element={<Login />} />
        </Routes>
      </BrowserRouter>

    </>
  );


  function userUpdate() {
    const userString: string = cleanString(
      JSON.stringify(sessionStorage.getItem(SessionStorage.USER_CREDENTIALS))
    );
    try {
      const cachedUser: UserCredential = JSON.parse(userString);
      setUser(cachedUser, dispatch);
    } catch (error) {
    }
    console.log(user);
  }
}

export default App;

function setUser(userCredentials: UserCredential, dispatch: any) {
  dispatch({
    type: actionTypes.SET_USER,
    user: userCredentials
  })
  const userString = JSON.stringify(userCredentials)
  sessionStorage.setItem(SessionStorage.USER_CREDENTIALS, userString)
}

function cleanString(str: string): string {
  if (str.length > 1 && str[0] === '"' && str[str.length - 1] === '"') {
    return str.slice(1, -1);
  } else {
    return str;
  }
}

