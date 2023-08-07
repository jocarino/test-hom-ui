import { User, UserCredential } from "firebase/auth";
import { doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc } from "firebase/firestore";
import { NavigateFunction } from "react-router-dom";
import { db } from "../api/Firebase";
import { actionTypes } from "../context/reducer";
import { UserInfo } from "../types/user";
import { isNullOrUndefined } from "../utils/utils";

export const setUser = async (dispatch: any, result: UserCredential, navigate: NavigateFunction) => {
    dispatch({
      type: actionTypes.SET_USER,
      user: result.user
    });
    const userString = JSON.stringify(result.user);
    sessionStorage.setItem(process.env.REACT_APP_USER_CREDENTIALS || '', userString);
    await fetchUserInfo(result.user, dispatch)
    return navigate("/posters")
  }

const fetchUserInfo = async (user: User, dispatch: any) => {
    console.log('fetchUserInfo', user?.uid, dispatch)
    const fetchedUserInfo = await getUserInfo(user?.uid)
    console.log('fetchedUserInfo', fetchedUserInfo)
    dispatch({
        type: 'SET_USER_INFO',
        userInfo: fetchedUserInfo
    })
}

/**
 * Retrieves data from userInfo collection.
 * Packages it in a readable format.
 * @param uid
 * @returns userInfo
 */
export const getUserInfo = async (uid: string) : Promise<UserInfo> => {
    console.log("uid", uid)
    if (isNullOrUndefined(uid)) {
        throw new Error("uid is null or undefined")
    }
    const response: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'userInfo', uid));
    const data: DocumentData | undefined = response.data()
    if (isNullOrUndefined(data)) {
        throw new Error("data is null or undefined")
    }
    const viewed: DocumentReference[] = data?.viewed as DocumentReference[]
    console.log("response", data?.viewed)

    let viewedPosters: string[] = []
    viewed.forEach(v => v.id && viewedPosters.push(v.id))

    console.log("viewdPosters", viewedPosters)
    
    let accessLevel: number = data?.accessLevel as number 

    return {viewedPosters: viewedPosters, accessLevel: accessLevel} as UserInfo
}