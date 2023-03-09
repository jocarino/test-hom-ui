import React from "react";
import { Link, redirect } from "react-router-dom";
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

function Header() {
    const [{ user }, dispatch] = useStateValue();

    const signOut = () => {
        dispatch({
            type: actionTypes.SET_USER,
            user: null
        });
        sessionStorage.removeItem(process.env.REACT_APP_USER_CREDENTIALS || '');
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