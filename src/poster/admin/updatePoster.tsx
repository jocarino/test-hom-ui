import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../api/Firebase'; // Import your Firebase configuration
import { PosterData as Poster, PosterData, CreatePosterState } from '../../types/poster';
import { useLocation } from 'react-router-dom';
import { ImageWrapper } from '../posterSC';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


const PosterCMSPage: React.FunctionComponent = () => {
    const [state, setState] = useState<string>(CreatePosterState.Loading);
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
                setState(CreatePosterState.NotFound)
                return
            }
            const posterRef = doc(db, 'posters', posterId)
            const posterDoc = await getDoc(posterRef);
            if (posterDoc.exists()) {
                const posterData = posterDoc.data() as PosterData;
                const imageRef = ref(storage, `posters/${posterId}`);
                setImageUrl(await getDownloadURL(imageRef));
                setTitle(posterData.title ?? '');
                setDescription(posterData.description ?? '');
                setState(CreatePosterState.Loaded);
            }
            else {
                setState(CreatePosterState.NotFound)
            }
        };
        fetchData();
    }, [posterId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setState(CreatePosterState.Loading)
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0])); // set the image URL
        }
        setState(CreatePosterState.Loaded)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!posterId) {
            setState(CreatePosterState.Error)
            return
        }

        // Upload the new image to Firebase Storage, if available
        if (image) {
            setState(CreatePosterState.Loading);

            const newImageRef = ref(storage, `posters/${posterId}`);
            const uploadImageResonse = await uploadBytes(newImageRef, image)
        }
        // Update the poster information in Firestore
        if (title.length > 0 || description.length > 0) {
            setState(CreatePosterState.Loading);
            const posterRef = doc(db, 'posters', posterId)
            await updateDoc(posterRef, {
                title,
                description,
            });
        }
        setState(CreatePosterState.Loaded);
    };

    switch (state) {
        case CreatePosterState.Loading: {
            return <div>Loading...</div>;
        }
        case CreatePosterState.Loaded: {
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
        case CreatePosterState.NotFound: {
            return <div>Not found.</div>;
        }
        case CreatePosterState.Error:
        default: {
            return <div>Something went wrong...</div>;
        }
    }


};

export default PosterCMSPage;
