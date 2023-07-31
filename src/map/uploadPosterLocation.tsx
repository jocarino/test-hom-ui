import React, { useEffect, useState } from "react";
import { db } from "../api/Firebase";
import { doc, updateDoc, GeoPoint, getDocs, query, collection } from "firebase/firestore";
import { isNullOrUndefined } from "../utils/utils";
import { PosterLocation } from "../types/poster";


const UploadPosterLocation: React.FunctionComponent = () => {
    const [posterValidation, setPosterValidation] = useState({ showMessage: false, isValid: false, message: '' })
    const [postersList, setPostersList] = useState<string[] | undefined>(undefined)
    const [posterName, setPosterName] = useState<string | undefined>(undefined)

    useEffect(() => {
        const callerFunction = async () => {
            const posterIds: string[] = [];
            const response = (await getDocs(query(collection(db, 'posters'))));
            response.forEach((doc: any) => {
                const posterId = doc.id
                posterIds.push(posterId)
            });
            setPostersList(posterIds)
        }
        callerFunction()
    }, [])


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!posterName) return

        navigator.geolocation.getCurrentPosition(async function (position) {
            if (isNullOrUndefined(position)) return
            try {
                // Update poster location
                // make type safe
                const posterLocation: PosterLocation = {
                    coordinates: new GeoPoint(position.coords.latitude, position.coords.longitude),
                };
                const posterRef = doc(db, "posters", posterName);
                await updateDoc(posterRef, posterLocation)
                setPosterValidation(
                    {
                        showMessage: true,
                        isValid: true,
                        message: 'Location successfully updated'
                    })
            } catch (e) {
                console.log("Error adding document: ", e);
                setPosterValidation(
                    {
                        showMessage: true,
                        isValid: false,
                        message: 'Please enter a valid poster'
                    })
            }
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Poster name:
                    <select name="poster-names" id="poster-names" onChange={e => setPosterName(e.target.value)}>
                        {postersList && postersList.map((posterName) => {
                            return <option value={posterName}>{posterName}</option>
                        })}
                    </select>
                </label>
                <input type="submit" value="Submit" />
            </form>
            {posterValidation.showMessage ? <p>{posterValidation.message}</p> : undefined}
        </>
    )
}

export default UploadPosterLocation