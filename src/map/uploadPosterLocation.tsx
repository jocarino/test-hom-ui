import React, { useState } from "react";
import { db } from "../api/Firebase";
import { doc, updateDoc, GeoPoint } from "firebase/firestore";
import { isNullOrUndefined } from "../utils/utils";
import { PosterLocation } from "../types/poster";


const UploadPosterLocation: React.FunctionComponent = () => {
    const [posterName, setPosterName] = useState('')
    const [posterValidation, setPosterValidation] = useState({ showMessage: false, isValid: false, message: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPosterName(e.target.value)
        console.log(`Poster name: ${e.target.value}`);

    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (posterName === '' || isNullOrUndefined(posterName)) return

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
                    <input type="text" value={posterName} onChange={handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            {posterValidation.showMessage ? <p>{posterValidation.message}</p> : undefined}
        </>
    )
}

export default UploadPosterLocation