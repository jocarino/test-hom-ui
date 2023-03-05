import React, { useState } from "react";
import db from "../api/Firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { isNullOrUndefined } from "../utils/utils";
import { initializeApp } from "firebase/app";


const UploadPosterLocation: React.FunctionComponent = () => {


    const [posterName, setPosterName] = useState('')
    const [posterValidation, setPosterValidation] = useState({ showMessage: false, isValid: false, message: '' })
    const locations: Array<{
        lat: number, lng: number
    }> = []

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPosterName(e.target.value)
        console.log(`Poster name: ${e.target.value}`);

    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (posterName === '' || isNullOrUndefined(posterName)) return

        navigator.geolocation.getCurrentPosition(async function (position) {
            if (isNullOrUndefined(position)) return

            locations.push({ lat: position.coords.latitude, lng: position.coords.longitude })

            try {
                // Update poster location
                const posterLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                const posterRef = doc(db, "posters", posterName);
                await updateDoc(posterRef, posterLocation)
                setPosterValidation(
                    {
                        ...posterValidation,
                        showMessage: true,
                        isValid: true,
                        message: 'Location successfully updated'
                    })
            } catch (e) {
                console.log("Error adding document: ", e);
                setPosterValidation(
                    {
                        ...posterValidation,
                        showMessage: true,
                        isValid: false,
                        message: 'Please enter a valid poster'
                    })
            }
        });

        console.log(`${posterName}: ${locations.pop()?.lat}, ${locations.pop()?.lng}`);

        e.preventDefault()
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