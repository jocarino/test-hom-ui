import { listAll, ref, StorageReference } from "firebase/storage";
import { db, storage } from "../api/Firebase";
import Poster from "./poster"
import loadingGif from '../common/images/loading.gif'
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { PosterData, PosterDoc } from "./types";

const PosterFeed: React.FunctionComponent = () => {

    const [postersData, setPostersData] = useState<PosterDoc[]>([]);

    useEffect(() => {
        const callerFunction = async () => {
            const postersDocData: PosterDoc[] = [];
            const response = (await getDocs(query(collection(db, 'posters'))));
            await response.forEach((doc: any) => {
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
            {postersData.map((posterData) =>
                <li key={posterData.id}>
                    <Poster
                        id={`poster_${posterData.id}`}
                        posterId={posterData.id}
                        title={posterData.title}
                        description={posterData.description}
                    />
                </li>
            )}</>
}
export default PosterFeed