import { doc, setDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../api/Firebase';
import { ImageWrapper } from '../posterSC';
import { PosterData } from '../types';

enum State {
    Idle = 'idle',
    Loading = 'loading',
    Loaded = 'loaded',
    Error = 'error'
}



const CreatePosterPage: React.FunctionComponent = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [state, setState] = useState<State>(State.Idle);
    const navigate = useNavigate();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0])); // set the image URL
        }

    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(State.Loading);

        // Upload the new image to Firebase Storage, if available
        if (image && title.length > 0) {
            const posterId = title.replace(/\s/g, '')
            const newImageRef = ref(storage, `posters/${posterId}`);
            const uploadImageResponse = await uploadBytes(newImageRef, image);
            setImageUrl(await getDownloadURL(newImageRef));

            // Add a new poster to Firestore
            const postersRef = doc(db, 'posters', posterId);
            const newPosterData: PosterData = {
                title,
                description,
            };
            await setDoc(postersRef, newPosterData);

            // Redirect to poster page with the posterId query parameter
            navigate(`/admin/poster?posterId=${posterId}`);

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
                    <ImageWrapper src={imageUrl} />
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
                        <button type="submit">Create Poster</button>
                    </form>
                </div>
            );
        }
        case State.Error:
        default: {
            return <div>Something went wrong...</div>;
        }
    }
};

export default CreatePosterPage;