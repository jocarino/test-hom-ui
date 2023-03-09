import { UserCredential } from "firebase/auth"
import React, { Context, useContext, useState, useReducer } from "react"

const StateContext = React.createContext()

export function StateProvider({ initialState, reducer, children }) {

    return (
        <StateContext.Provider value={useReducer(reducer, initialState)}>
            { children }
        </StateContext.Provider>

    );
}

export const useStateValue = () => useContext(StateContext)