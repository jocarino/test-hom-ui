import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

const MyMap: React.FunctionComponent = () => {
    const defaultZoom = 13
    const [map, setMap] = useState<L.Map | null>(null)
    const [location, setLocation] = useState<{
        lat: number;
        lng: number;
    }>();
    const [_, setError] = useState<GeolocationPositionError | null>(null);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                if (map && location) {
                    map.setView([location.lat, location.lng])
                    console.log(`location ${location.lat},${location.lng}`);
                }
            },
            (error) => () => {
                setError(error)
                console.log(error);
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [JSON.stringify(location), map])

    const displayMap = useMemo(
        () => {
            const center: L.LatLngExpression = [51.505, -0.09]

            return (location ? (<MapContainer ref={setMap} center={center} zoom={defaultZoom} scrollWheelZoom={true} >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={location} />
            </MapContainer >) : undefined)
        }, [location]
    )

    if (!location) { return <h1>Loading...</h1> }

    const reCenterButton = (map: L.Map) => {
        const onClick = () => {
            map.setView([location.lat, location.lng], defaultZoom)
        }
        return (
            <p>
                <button onClick={onClick}>Re-center</button>
            </p >
        )
    }

    return (
        <>
            <h1>Test</h1>
            {displayMap}
            {map ? reCenterButton(map) : null}
        </>
    );
};

export default MyMap;