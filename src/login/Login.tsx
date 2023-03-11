import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, UserCredential } from "firebase/auth";
import React, { useState, FormEvent } from "react";
import { NavigateFunction, useNavigate, useNavigation } from "react-router-dom";
import { auth, googleProvider } from "../api/Firebase"
import { SessionStorage } from "../common/constants";
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [{ user }, dispatch] = useStateValue();
  const navigate: NavigateFunction = useNavigate()

  // useEffect(() => {
  //   console.log("user effect redirect");
  //   if (user !== null) {
  //     console.log("user not null");

  //     return redirect("/")
  //   }
  // }, [user])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        setUser(dispatch, result, navigate);
      }
      )
      .catch(error => alert(error.message));
  }
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // // const credential = GoogleAuthProvider.credentialFromResult(result);
        // // const token = credential ? credential.accessToken : null;
        /*
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        */
        setUser(dispatch, result, navigate);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        alert(errorMessage)
      });
  };

  return (
    <div>
      <form onSubmit={handleEmailLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;

function setUser(dispatch: any, result: UserCredential, navigate: NavigateFunction) {
  dispatch({
    type: actionTypes.SET_USER,
    user: result.user
  });
  const userString = JSON.stringify(result.user);
  sessionStorage.setItem(SessionStorage.USER_CREDENTIALS, userString);
  return navigate("/")
}

