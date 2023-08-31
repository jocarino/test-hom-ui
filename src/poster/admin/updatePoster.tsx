import { doc, setDoc, getDoc, updateDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../api/Firebase'; // Import your Firebase configuration
import { PosterData as Poster, PosterData, CreatePosterState } from '../../types/poster';
import { useLocation } from 'react-router-dom';
import { ImageWrapper } from '../posterSC';
import GenericPageContainer from '../../common/GenericPageContainer';
import { useNavigate } from 'react-router-dom';
import AdminPageContainer from '../../admin/adminPageContainer';
import { useStateValue } from '../../context/StateProvider';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}


const PosterCMSPage: React.FunctionComponent = () => {
    const [{ userInfo }] = useStateValue();
    const [state, setState] = useState<string>(CreatePosterState.Loading);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('')
    const navigate = useNavigate();

    const query = useQuery();
    const posterId = query.get('posterId') || null;

    // Fetch poster data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            if (!posterId) {
                setState(CreatePosterState.CreateNew)
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
        setState(CreatePosterState.Loading);

        // Upload the new image to Firebase Storage, if available
        if (image && title.length > 0) {
            const posterId = title.replace(/\s/g, '')
            const newImageRef = ref(storage, `posters/${posterId}`);
            const uploadImageResponse = await uploadBytes(newImageRef, image);

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

        setState(CreatePosterState.Loaded);
    };
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!posterId) {
            setState(CreatePosterState.Error)
            return
        }

        // Upload the new image to Firebase Storage, if available
        if (image) {
            setState(CreatePosterState.Loading);

            const newImageRef = ref(storage, `posters/${posterId}`);
            const uploadImageResponse = await uploadBytes(newImageRef, image)
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
            return (
                <AdminPageContainer userInfo={userInfo}>
                    <div>Loading...</div>;
                </AdminPageContainer>
            );
        }
        case CreatePosterState.Loaded: {
            return (
                <GenericPageContainer>
                    <AdminPageContainer userInfo={userInfo}>
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
                    </AdminPageContainer>
                </GenericPageContainer>
            );
        }
        case CreatePosterState.CreateNew: {
            return (
                <AdminPageContainer userInfo={userInfo}>
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
                </AdminPageContainer>
            );
        }
        case CreatePosterState.NotFound: {
            return (
                <AdminPageContainer userInfo={userInfo}>
                    <div>Not found.</div>
                </AdminPageContainer>
            );
        }
        case CreatePosterState.Error:
        default: {
            return (
                <AdminPageContainer userInfo={userInfo}>
                    <div>Something went wrong...</div>
                </AdminPageContainer>
            );
        }
    }


};

export default PosterCMSPage;
