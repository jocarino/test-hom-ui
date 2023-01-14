import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';

interface Props {
}

const MyMap: React.FunctionComponent<Props> = () => {
    const center: L.LatLngExpression = [51.505, -0.09]
    const defaultZoom = 13
    const [map, setMap] = useState<L.Map | null>(null)
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [_, setError] = useState<GeolocationPositionError | null>(null);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                if (map) {
                    map.setView([location.lat, location.lng])
                }
            },
            (error) => () => {
                setError(error)
                console.log(error);
            }
        );
        console.log(`location ${location.lat},${location.lng}`);

        return () => navigator.geolocation.clearWatch(watchId);
    }, [location.lat, location.lng, map])

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

    const LocationMarker = () =>
        <Marker position={location} />


    const displayMap = useMemo(
        () => (
            <MapContainer ref={setMap} center={center} zoom={defaultZoom} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
            </MapContainer>
        ), [location, LocationMarker, center]
    )

    return (
        <><h1>Test</h1>
            {displayMap}
            {map ? reCenterButton(map) : null}
        </>
    );
};

export default MyMap;