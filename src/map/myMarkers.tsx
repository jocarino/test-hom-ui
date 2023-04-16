import React from "react";
import { Marker, useMapEvents } from "react-leaflet";
import { PosterDoc } from "../types/poster";

type MyMarkersProps = {
    location: {
        lat: number;
        lng: number;
    };
    posters: PosterDoc[];
    loadPosters: () => void;
}

const MyMarkers: React.FunctionComponent<MyMarkersProps> = (props: MyMarkersProps) => {
    const { location, posters, loadPosters } = props;

    useMapEvents({
        moveend: () => {
            console.log('moveend');
            loadPosters();
        }
    })

    return (
        <>
            <Marker position={location} />
            {posters.length > 0 ?
                posters.filter((poster) => poster.coordinates && poster.coordinates != null)
                    .map((poster) => <Marker
                        position={[poster.coordinates!.latitude, poster.coordinates!.longitude]}
                        key={poster.id} />) :
                undefined}
        </>
    );
};

export default MyMarkers;