import React from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { PosterDoc } from "../types/poster";
import L, { Icon } from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import redMarker from '../common/images/location-pin.png'
import styled from "styled-components";

type MyMarkersProps = {
    location: {
        lat: number;
        lng: number;
    };
    posters: PosterDoc[];
    loadPosters: () => void;
}

const PosterPopupDescription = styled.p`
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
`
const PosterPopupTitle = styled.p`
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;  
    overflow: hidden;
`

const PosterPopup = styled(Popup)`
    max-width: 200px;
`

const MyMarkers: React.FunctionComponent<MyMarkersProps> = (props: MyMarkersProps) => {
    const { location, posters, loadPosters } = props;

    useMapEvents({
        moveend: () => {
            loadPosters();
        }
    })

    const PosterIcon = new L.Icon({
        iconUrl: redMarker,
        shadowUrl: iconShadow,
        iconSize: [41, 41],
        iconAnchor: [20.5, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [65, 41]
    });

    const LocationIcon = new L.Icon({
        iconUrl: icon,
        iconRetinaUrl: iconRetinaUrl,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [65, 41],
    });


    return (
        <>
            <Marker position={location} icon={LocationIcon} />
            {posters.length > 0 ?
                posters.filter((poster) => poster.coordinates && poster.coordinates != null)
                    .map((poster) =>
                        <Marker
                            position={[poster.coordinates!.latitude, poster.coordinates!.longitude]}
                            key={poster.id} icon={PosterIcon}>
                            <PosterPopup >
                                <PosterPopupTitle>{poster.title}</PosterPopupTitle>
                                <PosterPopupDescription >{poster.description}</PosterPopupDescription>
                            </PosterPopup>
                        </Marker >) :
                undefined
            }
        </>
    );
};

export default MyMarkers;