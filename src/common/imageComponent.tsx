import React from 'react';
import monalisa from './images/monalisa.jpg';
import check from './images/check.png';

interface Props {
  image: string;
  altText: string;
}

const ImageComponent: React.FC<Props> = ({ image, altText }) => {
    let imageSrc: string;
    switch (image) {
        case 'monalisa':
            imageSrc = monalisa;
            break;
        case 'check':
            imageSrc = check;
            break;
        default:
            imageSrc = '';
    }
    return (
    <img src={imageSrc} alt={altText} />
  );
}

export default ImageComponent;
