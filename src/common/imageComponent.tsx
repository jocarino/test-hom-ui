import React from 'react';
import monalisa from './images/monalisa.jpg';
import checked from './images/checked.png';
import unchecked from './images/unchecked.png';

interface Props {
    id: string;
    className?: string;
    image: string;
    altText: string;
    size?: {
        width?: number;
        height?: number;
    };
}

const ImageComponent: React.FC<Props> = ({ id, className, image, altText, size }) => {
    let imageSrc: string;
    switch (image) {
        case 'monalisa':
            imageSrc = monalisa;
            break;
        case 'checked':
            imageSrc = checked;
            break;
        case 'unchecked':
            imageSrc = unchecked;
            break;
        default:
            imageSrc = image;
    }
    return (
        <img id={id} className={className} src={imageSrc} alt={altText} height={size?.height} width={size?.width} />
    );
}

export default ImageComponent;
