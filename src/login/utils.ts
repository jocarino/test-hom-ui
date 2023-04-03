import { UserCredential } from "@firebase/auth";
import { NavigateFunction } from "react-router";
import { actionTypes } from "../context/reducer";

export function setUser(dispatch: any, result: UserCredential, navigate: NavigateFunction) {
    dispatch({
      type: actionTypes.SET_USER,
      user: result.user
    });
    const userString = JSON.stringify(result.user);
    sessionStorage.setItem(process.env.REACT_APP_USER_CREDENTIALS || '', userString);
    return navigate("/posters")
  }