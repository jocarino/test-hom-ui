export const initialState = {
    user: null,
    // pageIdx is the index of the element selected in the ButtonNavigationBar
    pageIdx: null
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_PAGEIDX: "SET_PAGEIDX"
};

const reducer = (state: any, action: { type: any; user: any; pageIdx: any; }) => {
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
        default:
            return state;
    }
};

export default reducer;