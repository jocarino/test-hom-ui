import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../api/Firebase";
import { PosterData, PosterDoc, PosterMode } from "../types/poster";
import loadingGif from '../common/images/loading.gif'
import Poster from "./poster";
import ImageList from "@mui/material/ImageList";
import { Link } from "react-router-dom";


const PosterCollection: React.FunctionComponent = () => {
    const [postersData, setPostersData] = useState<PosterDoc[]>([]);
    const [bottomNavHeight, setBottomNavHeight] = useState(0);

    useEffect(() => {
        const bottomNavElement = document.querySelector('div.bottom-navigation-bar');
        if (bottomNavElement) {
            const height = bottomNavElement.clientHeight;
            setBottomNavHeight(height);
        }
    }, []);

    useEffect(() => {
        // TODO: This method needs to be changed once we have user logic
        // because we need to get the posters that the user has checked
        const callerFunction = async () => {
            const postersDocData: PosterDoc[] = [];
            const response = (await getDocs(query(collection(db, 'posters'))));
            response.forEach((doc: any) => {
                const posterId = doc.id
                const posterData = doc.data() as PosterData
                postersDocData.push({ ...posterData, id: posterId } as PosterDoc)
                postersDocData.push({ ...posterData, id: posterId } as PosterDoc)
            });

            setPostersData(postersDocData)


        }
        callerFunction()
    }, [])

    return postersData.length === 0 ? <img src={loadingGif} alt="loading..." /> :
        <div style={{ paddingBottom: bottomNavHeight }}>
            <ImageList
                sx={{ width: '100%', height: '100%' }}
                cols={3}
                rowHeight={164}
                style={{ margin: 0, padding: 0 }}>
                {postersData.map((poster) =>
                    <li key={poster.id}>
                        <Link to={`/poster/:${poster.id}`}>
                            <Poster
                                mode={PosterMode.ImageOnly}
                                id={`poster_${poster.id}`}
                                posterId={poster.id}
                                title={poster.title}
                                description={poster.description}
                            />
                        </Link>
                    </li>
                )}
            </ImageList>
        </div >
};

export default PosterCollection;
