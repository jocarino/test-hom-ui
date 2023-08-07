import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import GenericPageContainer from "../common/GenericPageContainer";
import { useStateValue } from "../context/StateProvider";

const Profile = () => {
    const [{ user, userInfo }] = useStateValue();
    const navigate: NavigateFunction = useNavigate();


    useEffect(() => {
        if (!user) {
            // navigate to login
            navigate("/login");
        }
    }, [user])

    return (
        <GenericPageContainer>
            <h1>Profile</h1>
            <p>{user?.email}</p>
            <p>{user?.displayName}</p>
            {userInfo && userInfo.accessLevel > 1 ? (
                <div>
                    <Link to="/admin">
                        <p>Admin Dashboard</p>
                    </Link>
                </div>
            ) : (
                <></>
            )}
        </GenericPageContainer>
    );
};

export default Profile;