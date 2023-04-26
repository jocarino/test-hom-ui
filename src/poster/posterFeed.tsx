import { db } from "../api/Firebase";
import Poster from "./poster"
import loadingGif from '../common/images/loading.gif'
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { PosterData, PosterDoc } from "../types/poster";
import { Link } from "react-router-dom";

const PosterFeed: React.FunctionComponent = () => {

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
        const savePostersDataToCache = (postersData: PosterDoc[]) => {
            const postersDataString = JSON.stringify(postersData);
            localStorage.setItem('postersData', postersDataString);
        }
        const callerFunction = async () => {
            const postersDocData: PosterDoc[] = [];
            const response = (await getDocs(query(collection(db, 'posters'))));
            response.forEach((doc: any) => {
                const posterId = doc.id
                const posterData = doc.data() as PosterData
                postersDocData.push({ ...posterData, id: posterId } as PosterDoc)
            });

            setPostersData(postersDocData)
            savePostersDataToCache(postersDocData)


        }
        callerFunction()
    }, [])

    return postersData.length === 0 ? <img src={loadingGif} alt="loading..." /> :
        <div style={{ paddingBottom: bottomNavHeight }}>
            {postersData.map((poster: PosterDoc) =>
                <li key={poster.id}>
                    <Link to={`/poster/:${poster.id}`}>
                        <Poster
                            id={`poster_${poster.id}`}
                            posterId={poster.id}
                            title={poster.title}
                            description={poster.description}
                        />
                    </Link>
                </li>
            )}
        </div>
}
export default PosterFeed