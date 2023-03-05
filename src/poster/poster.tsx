import React, { useState } from "react";
import ImageComponent from "../common/imageComponent";
import './poster.css';

interface Props {
    title: string;
    description: string;
    imageSrc: string;
}

const Poster: React.FunctionComponent<Props> = ({title, description, imageSrc}) => {
    const [checked, setChecked] = useState(false);

    const toggleCheck = () => {
        setChecked(!checked);
    }
    
    return (
        <div className="poster_view">
            <h1>{title}</h1>
            <p>{description}</p>
            <ImageComponent className="checked_unchecked" image={checked ? 'checked' : 'unchecked'} altText="Checked" />
            <ImageComponent className="poster_img" image={imageSrc} altText="Example" />
            <button onClick={toggleCheck}>{checked ? 'Not Seen' : 'Seen'}</button>
        </div>
    )
}

export default Poster;