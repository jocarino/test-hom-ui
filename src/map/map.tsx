import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { getPostersOnMap } from './firestore';
import { PosterDoc } from '../types/poster';
import MyMarkers from './myMarkers';

const MyMap: React.FunctionComponent = () => {
    const defaultZoom = 13
    const [map, setMap] = useState<L.Map | null>(null)
    const [location, setLocation] = useState<{
        lat: number;
        lng: number;
    }>();
    const [postersData, setPostersData] = useState<PosterDoc[]>([]);
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
                alert(error);
            }
        );

        loadPosters();
        return () => navigator.geolocation.clearWatch(watchId);
    }, [JSON.stringify(location), map])

    const loadPosters = useCallback(() => {
        if (!map) return;
        getPostersOnMap(map)
            .then((posters) => {
                setPostersData(posters)
                console.log(postersData);
            })
            .catch((error) => console.log(error));
    }, [map, postersData, setPostersData])


    const displayMap = useMemo(
        () => {
            const center: L.LatLngExpression = [51.505, -0.09]

            return (location ? (<MapContainer ref={setMap} center={center} zoom={defaultZoom} scrollWheelZoom={true} >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MyMarkers location={location} posters={postersData} loadPosters={loadPosters} />
            </MapContainer >) : undefined)
        }, [location, postersData, loadPosters]
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