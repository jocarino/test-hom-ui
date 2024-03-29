import './App.css';
import MapHomePage from './map/mapHomePage';
import 'leaflet/dist/leaflet.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import UploadPosterLocation from './map/uploadPosterLocation';
import PosterFeed from './poster/posterFeed';
import PosterCMSPage from './poster/admin/updatePoster';
import CreatePosterPage from './poster/admin/createPoster';
import { useStateValue } from './context/StateProvider';
import { actionTypes } from './context/reducer';
import { UserCredential } from 'firebase/auth';
import { useEffect } from 'react';
import Header from './header/Header';
import BottomNavigationBar from './common/BottomNavigationBar';
import Login from './login/Login';
import CreateAccountWithEmail from './login/CreateAccountWithEmail';
import PosterPage from './poster/posterPage';
import PosterCollection from './poster/posterCollection';
import Profile from './profile/Profile';

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    userUpdate()
  }, [])

  function userUpdate() {
    // get user from session storage
    const userString: string = cleanString(sessionStorage.getItem(process.env.REACT_APP_USER_CREDENTIALS || '') || '');
    if (userString === '') return;
    try {
      const cachedUser: UserCredential = JSON.parse(userString) as UserCredential;
      setUser(cachedUser, dispatch);
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/"
            element={<MapHomePage />} />
          <Route path="/login"
            element={<Login />} />
          <Route path="/createAccountWithEmailAndPassword"
            element={<CreateAccountWithEmail />} />
          <Route path="/profile"
            element={<Profile />} />
          <Route path="/posters"
            element={<PosterFeed />} />
          <Route path='/poster/:name'
            element={<PosterPage />} />
          <Route path="/posters-collection"
            element={<PosterCollection />} />
          <Route path='/admin/poster/location'
            element={<UploadPosterLocation />} />
          <Route path="/admin/poster"
            element={<PosterCMSPage />} />
          <Route path="/admin/poster/new"
            element={<CreatePosterPage />} />
        </Routes>
        <BottomNavigationBar />
      </BrowserRouter>
    </>
  );

}

export default App;

function setUser(userCredentials: UserCredential, dispatch: any) {
  dispatch({
    type: actionTypes.SET_USER,
    user: userCredentials
  })
  const userString = JSON.stringify(userCredentials)
  sessionStorage.setItem(process.env.REACT_APP_USER_CREDENTIALS || '', userString)
}

function cleanString(str: string): string {
  if (str.length > 1 && str[0] === '"' && str[str.length - 1] === '"') {
    return str.slice(1, -1);
  } else {
    return str;
  }
}

