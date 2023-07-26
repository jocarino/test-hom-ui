import { Button, Card, CardContent, Divider, TextField } from "@mui/material";
import { Google } from '@mui/icons-material';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, UserCredential } from "firebase/auth";
import React, { useState, FormEvent } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../api/Firebase"
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { setUser } from "./utils";
import "./Login.css";
import GenericPageContainer from "../common/GenericPageContainer";

export type Errors = {
  email: string | null;
  password: string | null;
}

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({ email: null, password: null });
  const [{ user }, dispatch] = useStateValue();
  const navigate: NavigateFunction = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({ email: null, password: null });
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({ email: null, password: null });
    setPassword(e.target.value);
  };

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        setUser(dispatch, result, navigate);
      }
      )
      .catch(error => {
        if (error.code === "auth/user-not-found") {
          setErrors({ email: "Email not found", password: null });
        } else if (error.code === "auth/wrong-password") {
          setErrors({ email: null, password: "Password is incorrect" });
        } else {
          setErrors({ email: "", password: "" });
          alert("Unexpected error, please try again later")
        }
      });
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
    <GenericPageContainer>
      <div id="login-container">
        <Card sx={{ width: "90%" }} >
          <CardContent>
            <h1>Log in</h1>
            <form onSubmit={handleEmailLogin}>
              <TextField
                type="email"
                id="email"
                name="email"
                label="Email"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
                value={email}
                onChange={handleEmailChange}
              />
              <TextField
                type="password"
                id="password"
                name="password"
                label="Password"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
                value={password}
                onChange={handlePasswordChange}
              />
              <br />
              <Button variant="contained" size="large" type="submit">Log in</Button>
              <hr style={{ width: '50px', margin: '16px 0' }}></hr>
              <Button variant="outlined" size="large" startIcon={<Google />} onClick={handleGoogleLogin}>Sign in with Google</Button>
              <hr style={{ width: '50px', margin: '16px 0' }}></hr>
            </form>
            <p style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0' }}>
              You don't have an account yet? <Link to="/createAccountWithEmailAndPassword">Create account with email</Link>
            </p>
          </CardContent>
        </Card>
      </div >
    </GenericPageContainer>
  );
};


export default Login;