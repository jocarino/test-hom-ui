import React, { useState } from "react";
import ImageComponent from "../common/imageComponent";

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
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
            <ImageComponent image={imageSrc} altText="Example" />
            <div onClick={toggleCheck}>
                {checked ? 
                    <ImageComponent image="check" altText="Checked" /> : 
                    null
                }
            </div>
        </div>
    )
}

export default Poster;