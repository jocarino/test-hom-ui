import React from "react";
import { Link, redirect } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import Login from "../login/Login";

function Header() {
    const [{ user }] = useStateValue();


    return (
        <div>
            {!user ?
                <Link to="/login">sign in</Link>
                :
                user.displayName
            }
        </div>
    )
}

export default Header;