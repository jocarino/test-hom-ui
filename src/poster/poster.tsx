import { ref, getDownloadURL } from "@firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../api/Firebase";
import ImageComponent from "../common/imageComponent";
import './poster.css';
import loadingGif from '../common/images/loading.gif'
import { PosterMode } from "../types/poster";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { GeoPoint } from "firebase/firestore";
import { useStateValue } from "../context/StateProvider";

interface Props {
    mode: PosterMode;
    id: string;
    posterId: string;
    title: string;
    description: string;
    coordinates?: GeoPoint;
}

const Poster: React.FunctionComponent<Props> = ({ mode, id, posterId, title, description, coordinates }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const imageRef = ref(storage, `/posters/${posterId}`)
    const [{ userInfo }] = useStateValue();

    useEffect(() => {
        const cachedUrl: string | null = localStorage.getItem(imageRef.name);
        const fetchAndSetImageUrlFromServer = async () => {
            try {
                const url = await getDownloadURL(imageRef);
                // cache this url, because this request makes it too slow      
                localStorage.setItem(imageRef.name, url)
                setImageUrl(url);
            } catch (error) {
                console.log(error);
            }
        };
        if (cachedUrl !== null) {
            setImageUrl(cachedUrl)
        } else {
            fetchAndSetImageUrlFromServer();
        }

    }, [imageRef]);

    switch (mode) {
        case PosterMode.Feed:
            return (
                <Card sx={{ mb: 2, backgroundColor: userInfo?.viewedPosters?.includes(posterId) ? "white" : "#ecf0f1" }}>
                    <CardMedia
                        style={{ width: "90vw", maxWidth: '400px', minHeight: "400px", maxHeight: "400px" }}
                        image={imageUrl || loadingGif}
                        title={title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" style={{ textDecoration: 'none' }} >
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" >
                            {description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" href={`/poster/:${posterId}`}>See more</Button>
                        {coordinates && <Button size="small" href={`/?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`}>Discover in map</Button>}
                    </CardActions>
                </Card>

            )

        case PosterMode.ImageOnly:
            return (<ImageComponent
                id={`posterimage_${imageRef.name}`}
                className="poster_img"
                image={imageUrl || loadingGif}
                altText="Example"
            />)
        case PosterMode.Page:
            return (
                <div key={id} id={id} className="poster_view">
                    <h1>{title}</h1>
                    <p>{description}</p>
                    <ImageComponent
                        id={`imgcheckmark_${imageRef.name}`}
                        className="checked_unchecked"
                        image={userInfo?.viewedPosters?.includes(posterId) ? 'checked' : 'unchecked'}
                        altText="Checked"
                    />
                    <ImageComponent
                        id={`posterimage_${imageRef.name}`}
                        className="poster_img"
                        image={imageUrl || loadingGif}
                        altText="Example"
                    />
                </div>
            )
    }
}

export default Poster;