import { ref, getDownloadURL } from "@firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../api/Firebase";
import ImageComponent from "../common/imageComponent";
import './poster.css';
import loadingGif from '../common/images/loading.gif'

interface Props {
    id: string;
    posterId: string;
    title: string;
    description: string;
}

const Poster: React.FunctionComponent<Props> = ({ id, posterId, title, description }) => {
    const [checked, setChecked] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const imageRef = ref(storage, `/posters/${posterId}`)

    const toggleCheck = () => {
        setChecked(!checked);
    };

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
            } catch (error) {
                console.log(error);
            }
        };

        fetchImage();
    }, [imageRef]);

    return (
        <div key={id} id={id} className="poster_view">
            <h1>{title}</h1>
            <p>{description}</p>
            <ImageComponent
                id={`imgcheckmark_${imageRef.name}`}
                className="checked_unchecked"
                image={checked ? 'checked' : 'unchecked'}
                altText="Checked"
            />
            <ImageComponent
                id={`posterimage_${imageRef.name}`}
                className="poster_img"
                image={imageUrl || loadingGif}
                altText="Example"
            />
            <button onClick={toggleCheck}>{checked ? 'Not Seen' : 'Seen'}</button>
        </div>
    )
}

export default Poster;