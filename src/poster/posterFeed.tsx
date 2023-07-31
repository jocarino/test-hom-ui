import { db } from "../api/Firebase";
import Poster from "./poster"
import loadingGif from '../common/images/loading.gif'
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { PosterData, PosterDoc, PosterMode } from "../types/poster";
import GenericPageContainer from "../common/GenericPageContainer";
import { useStateValue } from "../context/StateProvider";
import { Box, Tabs, Tab } from "@mui/material";
import { a11yProps, TabPanel } from "./posterFeedTab";
import { getUserInfo, range } from "../utils/utils";

const PosterFeed: React.FunctionComponent = () => {
    const [{ user, userInfo }, dispatch] = useStateValue();


    const [postersData, setPostersData] = useState<PosterDoc[]>([]);
    const [currentTab, setCurrentTab] = useState<number>(0);


    useEffect(() => {
        console.log('user', user?.uid)

        const callerFunction = async () => {
            const fetchedUserInfo = await getUserInfo(user?.uid)
            dispatch({
                type: 'SET_USER_INFO',
                userInfo: fetchedUserInfo
            })
        }
        callerFunction()
    }, [user])

    useEffect(() => {
        const savePostersDataToCache = (postersData: PosterDoc[]) => {
            const postersDataString = JSON.stringify(postersData);
            const now: Date = new Date();
            localStorage.setItem('postersData', postersDataString);
            localStorage.setItem('postersDataTimestamp', now.toString());
        }
        const postersDocData: PosterDoc[] = [];
        const fetchAndLoadPostersFromServer = async () => {
            const response = (await getDocs(query(collection(db, 'posters'))));
            response.forEach((doc: any) => {
                const posterId = doc.id
                const posterData = doc.data() as PosterData
                postersDocData.push({ ...posterData, id: posterId } as PosterDoc)
            });

            setPostersData(postersDocData)
            savePostersDataToCache(postersDocData)


        }
        const loadPostersFromCache = (posterDataFromCache: PosterDoc[]) => {
            posterDataFromCache.forEach((doc: any) => {
                const posterId = doc.id
                const posterData = doc as PosterData
                postersDocData.push({ ...posterData, id: posterId } as PosterDoc)
            });
            setPostersData(postersDocData)

        }
        if (localStorage.getItem('postersData') && localStorage.getItem('postersDataTimestamp')) {
            const posterDataFromCache: PosterDoc[] = JSON.parse(localStorage.getItem('postersData') || '') as PosterDoc[];
            const lastUpdate: Date = new Date(Date.parse(localStorage.getItem('postersDataTimestamp') || ''));

            const oneHourAgo: Date = new Date(Date.now() - 60 * 60 * 1000);

            // if latest update was made over one hour ago, it will reload the poster data
            // else use cached poster data
            if (lastUpdate < oneHourAgo) {
                console.log('old cache, reloading...')
                fetchAndLoadPostersFromServer()
            } else {
                console.log('posters in cache, loading...')
                loadPostersFromCache(posterDataFromCache)
            }
        } else {
            console.log('no posters in cache, loading...')
            fetchAndLoadPostersFromServer()
        }
    }, [])

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return postersData.length === 0 ? <img src={loadingGif} alt="loading..." /> :
        <GenericPageContainer>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs sx={{ display: 'flex', justifyContent: 'center' }} value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="New" {...a11yProps(0)} />
                        <Tab label="Seen" {...a11yProps(1)} />
                        <Tab label="All" {...a11yProps(2)} />
                    </Tabs>
                </Box>
            </Box>
            {range(0, 2).map((index: number) =>
                <TabPanel value={currentTab} index={index}>
                    {postersData.filter((poster: PosterDoc) => {
                        switch (index) {
                            case 0:
                                return !userInfo?.viewedPosters?.includes(poster.id)
                            case 1:
                                return userInfo?.viewedPosters?.includes(poster.id)
                            case 2:
                                return true
                            default:
                                return false
                        }
                    }).map((poster: PosterDoc) =>
                        <div key={poster.id}>
                            <Poster
                                mode={PosterMode.Feed}
                                id={`poster_${poster.id}`}
                                posterId={poster.id}
                                title={poster.title}
                                description={poster.description}
                                coordinates={poster.coordinates}
                            />
                        </div>
                    )}
                </TabPanel>
            )}
        </GenericPageContainer>
}
export default PosterFeed