import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../api/Firebase';
import { PosterData, PosterDoc } from '../types/poster';
import Poster from './poster';

const PosterPage: React.FunctionComponent = () => {
    let { name } = useParams();
    name = name?.replace(':', '');
    const [poster, setPoster] = useState<PosterDoc>({ id: '', title: '', description: '' } as PosterDoc);

    const loadPostersDataFromCache = () => {
        const postersDataString = localStorage.getItem('postersData');
        if (postersDataString) {
            return JSON.parse(postersDataString) as PosterDoc[];
        }
        return [];
    }

    useEffect(() => {
        const postersData = loadPostersDataFromCache();
        const poster = postersData.find((poster: PosterDoc) => poster.id === name);
        if (poster) {
            console.log('poster found in cache');
            setPoster(poster);
            return;
        }
        const callerFunction = async () => {
            console.log('poster not found in cache. fetching from db');
            const response = await getDoc(doc(db, 'posters', name || ''));
            const posterData = response.data() as PosterData;
            setPoster({ ...posterData, id: name } as PosterDoc);
        }
        callerFunction();
    }, [name]);

    return (
        <div>
            <h1>
                Poster Page
            </h1>
            <br />
            <Poster
                id={`poster_${poster.id}`}
                posterId={poster.id}
                title={poster.title}
                description={poster.description}
            />
        </div>
    )
}

export default PosterPage;