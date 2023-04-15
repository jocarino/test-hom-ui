import { GeoPoint } from "firebase/firestore";

export type PosterData = {
    title: string;
    description: string;
    coordinates?: GeoPoint;
}

export type PosterLocation = {
    coordinates: GeoPoint;
}

export type PosterDoc = PosterData & { id: string }

export enum CreatePosterState {
    Loading = 'loading',
    Loaded = 'loaded',
    Error = 'error',
    NotFound = 'not-found'
}