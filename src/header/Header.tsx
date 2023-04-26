import { Button } from "@mui/material";
import React from "react";
import { Link, redirect } from "react-router-dom";
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import "./Header.css";
import styled from 'styled-components';
import { sign } from "crypto";
import ImageComponent from "../common/imageComponent";
import HOM_UI from '../common/images/hom-logo-bw.png'

function Header() {
    const [{ user }, dispatch] = useStateValue();

    const SignInStyledButton = styled(Button)`
        
        color: #000000 !important;
    `;

    const signOut = () => {
        dispatch({
            type: actionTypes.SET_USER,
            user: null
        });
        sessionStorage.removeItem(process.env.REACT_APP_USER_CREDENTIALS || '');
    }

    return (
        <div id="header-root">
            <div />
            <div>
                <ImageComponent
                    id={`imgcheckmark_HOM_UI`}
                    image={HOM_UI}
                    altText="HOM_UI logo"
                    size={{ width: 50, height: 50 }}
                />
            </div>
            <div>
                {!user ? (
                    <Link to="/login">
                        <SignInStyledButton variant="outlined" size="large">Sign In</SignInStyledButton>
                    </Link>
                ) : (
                    <SignInStyledButton variant="outlined" size="large" onClick={signOut}>Sign Out</SignInStyledButton>

                )
                }
            </div>
        </div>
    )
}

export default Header;