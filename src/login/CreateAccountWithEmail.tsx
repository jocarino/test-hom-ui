import { createUserWithEmailAndPassword } from "@firebase/auth";
import React, { FormEvent, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { auth } from "../api/Firebase";
import { useStateValue } from "../context/StateProvider";
import { setUser } from "./utils";


function CreateAccountWithEmail() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [{ user }, dispatch] = useStateValue();
    const navigate: NavigateFunction = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            .catch((error) => { console.log('firebase error', error) });
    };
    return (
        <div>
            <form onSubmit={createAccount}>
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
        </div>
    );
}

export default CreateAccountWithEmail;