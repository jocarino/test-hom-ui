import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../api/Firebase'; // Import your Firebase configuration
import { PosterData as Poster, PosterData } from '../types';
import { useLocation } from 'react-router-dom';
import { ImageWrapper } from '../posterSC';

enum State {
    Loading = 'loading',
    Loaded = 'loaded',
    Error = 'error',
    NotFound = 'not-found'
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


const PosterCMSPage: React.FunctionComponent = () => {
    const [poster, setPoster] = useState<Poster | null>(null);
    const [state, setState] = useState<string>(State.Loading);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('')

    const query = useQuery();
    const posterId = query.get('posterId') || null;

    // Fetch poster data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            if (!posterId) {
                setState(State.NotFound)
                return
            }
            const posterRef = doc(db, 'posters', posterId)
            const posterDoc = await getDoc(posterRef);
            if (posterDoc.exists()) {
                const posterData = posterDoc.data() as PosterData;
                const imageRef = ref(storage, `posters/${posterId}`);
                setImageUrl(await getDownloadURL(imageRef));
                setPoster(posterData);
                setTitle(posterData.title ?? '');
                setDescription(posterData.description ?? '');
                setState(State.Loaded);
            }
            else {
                setState(State.NotFound)
            }
        };
        fetchData();
    }, [posterId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(State.Loading);

        // Upload the new image to Firebase Storage, if available
        if (image && title.length > 0) {
            const newImageRef = ref(storage, `posters/${posterId}`);
            const uploadImageResonse = await uploadBytes(newImageRef, image)
            // TODO handle image upload response
            setImageUrl(await getDownloadURL(newImageRef));


            // Update the poster information in Firestore
            if (posterId) {
                const posterRef = doc(db, 'posters', posterId)
                await updateDoc(posterRef, {
                    title,
                    description,
                });
            }
        }

        setState(State.Loaded);
    };

    switch (state) {
        case State.Loading: {
            return <div>Loading...</div>;
        }
        case State.Loaded: {
            return (
                <div className="poster-page">
                    <div>
                        <ImageWrapper src={imageUrl} />
                    </div>

                    <form className="form-container" onSubmit={handleSubmit}>
                        <label>
                            Title:
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </label>
                        <p></p>
                        <label>
                            Description:
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </label>
                        <p></p>
                        <label>
                            Image:
                            <input type="file" onChange={handleImageUpload} />
                        </label>
                        <p></p>
                        <button type="submit">Update Poster</button>
                    </form>
                </div>
            );
        }
        case State.NotFound: {
            return <div>Not found.</div>;
        }
        case State.Error:
        default: {
            return <div>Something went wrong...</div>;
        }
    }


};

export default PosterCMSPage;
