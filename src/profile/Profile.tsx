import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";

const Profile = () => {
    const [{ user }] = useStateValue();
    const navigate: NavigateFunction = useNavigate();


    useEffect(() => {
        if (!user) {
            // navigate to login
            navigate("/login");
        }
    }, [user])

    return (<div>
        <h1>Profile</h1>
        <h2>{user?.email}</h2>
        <h2>{user?.displayName}</h2>
    </div>);
};

export default Profile;