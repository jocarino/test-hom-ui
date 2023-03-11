import React from "react";
import { Link, redirect } from "react-router-dom";
import { SessionStorage } from "../common/constants";
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import Login from "../login/Login";

function Header() {
    const [{ user }, dispatch] = useStateValue();

    const signOut = () => {
        dispatch({
            type: actionTypes.SET_USER,
            user: null
        });
        sessionStorage.removeItem(SessionStorage.USER_CREDENTIALS);
    }

    return (
        <>
            {!user ? (
                <Link to="/login">sign in</Link>
            ) : (
                <>
                    {user.displayName}
                    <span onClick={signOut}>sign out</span>
                </>
            )
            }
        </>
    )
}

export default Header;