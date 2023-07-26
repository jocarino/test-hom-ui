import { UserInfo } from "../types/user";

export const initialState = {
    user: null,
    // pageIdx is the index of the element selected in the ButtonNavigationBar
    pageIdx: null,
    userInfo: null
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_PAGEIDX: "SET_PAGEIDX",
    SET_USER_INFO: "SET_USER_INFO"
};

const reducer = (state: any, action: { type: any; user: any; pageIdx: any; userInfo: UserInfo | null }) => {
    console.log(action);
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user
            };
        case actionTypes.SET_PAGEIDX:
            return {
                ...state,
                pageIdx: action.pageIdx
            };
        case actionTypes.SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo
            };
        default:
            return state;
    }
};

export default reducer;