'use client';

import { useEffect, useState } from 'react';
import { FEED_NO_USER } from '../lib/constants';
import { useAppSelector } from '@/lib/store/hooks';
import { getUsersWithNoConnection } from './actions/user.actions';
import HomePageClientComponent from './components/Home';
import { totalUsersInACollege } from './actions/user.actions';
import NavBar from './components/NavBar';

export default function Home() {
    const [hydrated, setHydrated] = useState(false);
    const [usersWithNoConnection, setUsersWithNoConnection] = useState([]);
    const [total, setTotal] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, [])
    const userData = useAppSelector((state) => state.user.userData);
    const userId = userData?.data.userId;
    const getFeed = async () => {
        const usersWithNoConnection = await getUsersWithNoConnection(userId);
        // setUsersWithNoConnection(usersWithNoConnection);
        const totalUsers = await totalUsersInACollege(userId);
        setTotal(totalUsers);
        setDataLoaded(true);
    }

    useEffect(() => {
        if (hydrated && userId) {
            getFeed();
        }
    }, [hydrated, userId]);

    return (
        <main>
            <NavBar />
            {
                usersWithNoConnection.length > 0 ? (
                    <HomePageClientComponent currentUser={userData.data} users={usersWithNoConnection} />
                ) : (
                    dataLoaded && <div className='flex items-center justify-center h-[calc(100vh-4rem)]'>
                        <p>{FEED_NO_USER}</p>
                        <h1>total users in your college / organisation = {total}</h1>
                    </div>
                )
            }
        </main>
    );
}
