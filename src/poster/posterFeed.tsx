import { listAll, ref, StorageReference } from "firebase/storage";
import { storage } from "../api/Firebase";
import Poster from "./poster"
import loadingGif from '../common/images/loading.gif'
import { useEffect, useState } from "react";

const PosterFeed: React.FunctionComponent = () => {

    const [posterRefList, setPosterRefList] = useState<StorageReference[]>([]);


    // Create a reference under which you want to list
    const listRef = ref(storage, 'posters');
    const getPosterRefList = async () => {
        // Find all the prefixes and items.
        return listAll(listRef)
            .then((res) => {
                return res.items
            }).catch((error) => {
                // Uh-oh, an error occurred!
                alert(error)
                return []
            });
    }

    useEffect(() => {
        const callerFunction = async () => {
            setPosterRefList(await getPosterRefList())
        }
        callerFunction()
    }, [])

    return posterRefList.length === 0 ? <img src={loadingGif} alt="loading..." /> :
        <>
            {posterRefList.map(posterRef => <Poster
                imageRef={posterRef}
                title="posterTitle"
                description="posterDescription"
            />)}</>
}
export default PosterFeed