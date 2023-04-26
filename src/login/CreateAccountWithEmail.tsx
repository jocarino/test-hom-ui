import { createUserWithEmailAndPassword } from "@firebase/auth";
import { Button, Card, CardContent, TextField } from "@mui/material";
import React, { FormEvent, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { auth } from "../api/Firebase";
import { useStateValue } from "../context/StateProvider";
import { Errors } from "./Login";
import { setUser } from "./utils";


function CreateAccountWithEmail() {

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

    const createAccount = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                setUser(dispatch, userCredential, navigate);
                // ...
            })
            .catch((error) => {
                console.log(error.code);
                if (error.code === "auth/email-already-in-use") {
                    setErrors({ email: "Account already exists", password: null });
                } else if (error.code === "auth/weak-password") {
                    setErrors({ email: null, password: "Weak password" });
                } else {
                    setErrors({ email: "", password: "" });
                    alert("Unexpected error, please try again later")
                }
            });
    };
    return (
        <div id="login-container">
            <Card sx={{ width: "90%" }} >
                <CardContent>
                    <h1>Create Account</h1>
                    <form onSubmit={createAccount}>
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
                        <Button variant="contained" size="large" type="submit">Create Account</Button>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
}

export default CreateAccountWithEmail;