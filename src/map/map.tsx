import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface Props {
}

const MyMap: React.FunctionComponent<Props> = () => {
    const center: L.LatLngExpression = [51.505, -0.09]
    const mapRef = useRef<any>({})


    const LocationMarker = () => {
        const [position, setPosition] = useState<L.LatLngExpression | null>(null)
        const map = useMapEvents({
            locationfound(e) {
                setPosition(e.latlng)
                map.flyTo(e.latlng, map.getZoom())
            },
        })
        useEffect(() => {
            setTimeout(() => {
                map.locate()
                console.log('location')
            }, 1000);


        }, [map])


        return position === null ? null : (<Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>)
    }

    return (
        <><h1>Test</h1>
            <MapContainer ref={mapRef} center={center} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
            </MapContainer>
        </>
    );
};

export default MyMap;