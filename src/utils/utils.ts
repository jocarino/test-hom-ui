import { doc,  DocumentData,  DocumentReference,  DocumentSnapshot, getDoc } from "firebase/firestore";
import {  db } from "../api/Firebase";
import { UserInfo } from "../types/user";

export const isNullOrUndefined = (value: any) => {
    return value === undefined || value === null
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

    return {viewedPosters: viewedPosters} as UserInfo
}

export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }