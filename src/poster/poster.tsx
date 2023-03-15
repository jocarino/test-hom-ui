import { ref, StorageReference, getDownloadURL } from "@firebase/storage";
import React, { useState } from "react";
import { storage } from "../api/Firebase";
import ImageComponent from "../common/imageComponent";
import './poster.css';
import loadingGif from '../common/images/loading.gif'

interface Props {
    imageRef: StorageReference;
    title: string;
    description: string;
}

const Poster: React.FunctionComponent<Props> = ({ title, description, imageRef }) => {
    const [checked, setChecked] = useState(false);

    const toggleCheck = () => {
        setChecked(!checked);
    }

    getDownloadURL(imageRef)
        .then((url) => {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

            // Or inserted into an <img> element
            const img = document.getElementById(`posterimage${imageRef.name}`);
            if (img) {
                img.setAttribute('src', url);
            }
            console.log(url);

        })
        .catch((error) => {
            // Handle any errors
            console.log(error);

        });

    return (
        <div className="poster_view">
            <h1>{title}</h1>
            <p>{description}</p>
            <ImageComponent id={`imgcheckmark_${imageRef.name}`} className="checked_unchecked" image={checked ? 'checked' : 'unchecked'} altText="Checked" />
            <ImageComponent id={`posterimage_${imageRef.name}`} className="poster_img" image={loadingGif} altText="Example" />
            <button onClick={toggleCheck}>{checked ? 'Not Seen' : 'Seen'}</button>
        </div>
    )
}

export default Poster;