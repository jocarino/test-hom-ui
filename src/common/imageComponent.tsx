import React from 'react';
import monalisa from './images/monalisa.jpg';
import checked from './images/checked.png';
import unchecked from './images/unchecked.png';

interface Props {
  className?: string;
  image: string;
  altText: string;
}

const ImageComponent: React.FC<Props> = ({ className, image, altText }) => {
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
            imageSrc = '';
    }
    return (
    <img className={className} src={imageSrc} alt={altText} />
  );
}

export default ImageComponent;
