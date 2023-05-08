import { ref, getDownloadURL } from "@firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../api/Firebase";
import ImageComponent from "../common/imageComponent";
import './poster.css';
import loadingGif from '../common/images/loading.gif'
import { PosterMode } from "../types/poster";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { GeoPoint } from "firebase/firestore";

interface Props {
    mode: PosterMode;
    id: string;
    posterId: string;
    title: string;
    description: string;
    coordinates?: GeoPoint;
}

const Poster: React.FunctionComponent<Props> = ({ mode, id, posterId, title, description, coordinates }) => {
    const [checked, setChecked] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const imageRef = ref(storage, `/posters/${posterId}`)

    const toggleCheck = () => {
        setChecked(!checked);
    };

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
            } catch (error) {
                console.log(error);
            }
        };

        fetchImage();
    }, [imageRef]);

    switch (mode) {
        case PosterMode.Feed:
            return (
            <Card sx={{ maxWidth: 1, mb:2, backgroundColor: checked ? "white" : "#ecf0f1"}}>
                <CardMedia
                  sx={{ height: 250 }}
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
            return (<div key={id} id={id} className="poster_view">
            <h1>{title}</h1>
            <p>{description}</p>
            <ImageComponent
                id={`imgcheckmark_${imageRef.name}`}
                className="checked_unchecked"
                image={checked ? 'checked' : 'unchecked'}
                altText="Checked"
            />
            <ImageComponent
                id={`posterimage_${imageRef.name}`}
                className="poster_img"
                image={imageUrl || loadingGif}
                altText="Example"
            />
            <button onClick={toggleCheck}>{checked ? 'Not Seen' : 'Seen'}</button>
        </div>)
    }
}

export default Poster;