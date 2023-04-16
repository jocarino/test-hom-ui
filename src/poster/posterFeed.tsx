import { db } from "../api/Firebase";
import Poster from "./poster"
import loadingGif from '../common/images/loading.gif'
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { PosterData, PosterDoc } from "../types/poster";

const PosterFeed: React.FunctionComponent = () => {

    const [postersData, setPostersData] = useState<PosterDoc[]>([]);

    useEffect(() => {
        const callerFunction = async () => {
            const postersDocData: PosterDoc[] = [];
            const response = (await getDocs(query(collection(db, 'posters'))));
            response.forEach((doc: any) => {
                const posterId = doc.id
                const posterData = doc.data() as PosterData
                postersDocData.push({ ...posterData, id: posterId } as PosterDoc)
            });

            setPostersData(postersDocData)


        }
        callerFunction()
    }, [])

    return postersData.length === 0 ? <img src={loadingGif} alt="loading..." /> :
        <>
            {postersData.map((poster) =>
                <li key={poster.id}>
                    <Poster
                        id={`poster_${poster.id}`}
                        posterId={poster.id}
                        title={poster.title}
                        description={poster.description}
                    />
                </li>
            )}
        </>
}
export default PosterFeed