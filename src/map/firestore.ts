import { collection, CollectionReference, DocumentData, GeoPoint, getDocs, Query, query, QuerySnapshot, where } from 'firebase/firestore';
import { LatLngBounds } from 'leaflet';
import { db } from '../api/Firebase';
import { PosterData, PosterDoc } from '../types/poster';


export const getPostersOnMap = async (map: L.Map | null): Promise<PosterDoc[]> => {
    console.log('getPostersOnMap');
    const postersDocData: PosterDoc[] = [];
    if (map === null) return postersDocData;
    const bounds: LatLngBounds = map.getBounds();
    const maxLat: number = bounds.getNorth();
    const minLat: number = bounds.getSouth();
    const maxLng: number = bounds.getEast();
    const minLng: number = bounds.getWest();
    console.log('coordentate', maxLat, minLat, maxLng, minLng);
    const collectionRef: CollectionReference<DocumentData> = collection(db, 'posters');
    const q: Query<DocumentData> = query(collectionRef,
        where('coordinates', '<=', new GeoPoint(maxLat, maxLng)),
        where('coordinates', '>=', new GeoPoint(minLat, minLng)),
        );
    const docs: QuerySnapshot<DocumentData> = await getDocs(q);
    docs.forEach((doc: any) => {
        const posterId = doc.id
        const posterData = doc.data() as PosterData
        postersDocData.push({ ...posterData, id: posterId } as PosterDoc)
    });
    return postersDocData;
}