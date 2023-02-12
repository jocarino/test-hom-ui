import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyMap from './map';
// import UploadPosterLocation from './uploadPosterLocation';

const MapHomePage: React.FC = () => {
    return (
        <MyMap />
    );
};

export default MapHomePage;
