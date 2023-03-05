import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyMap from './map';
import UploadPosterLocation from './uploadPosterLocation';

const MapHomePage: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MyMap />}></Route>
                <Route path='/upload/poster-location' element={<UploadPosterLocation />}></Route>
            </Routes>
        </BrowserRouter >
    );
};

export default MapHomePage;
