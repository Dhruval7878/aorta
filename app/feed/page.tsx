'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import TinderCard from 'react-tinder-card';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MATCH_ALERT, FEED_NO_USER } from '@/lib/constants';
import { getUsersWithNoConnection, neo4jSwipe, totalUsersInACollege } from '../actions/user.actions';
import NavBar from '../components/NavBar';
import { OtherUsersDataForApp } from '@/db/schema/types';
import Image from 'next/image';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const FETCH_THRESHOLD = 3;

export default function Feed() {
    const [hydrated, setHydrated] = useState(false);
    const [users, setUsers] = useState<OtherUsersDataForApp[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [tot, setTot] = useState(0);
    const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: string]: number }>({});
    const cardRefs = useRef<{ [key: string]: any }>({});

    useEffect(() => {
        setHydrated(true);
    }, []);

    const userData = useAppSelector((state) => state.user.userData);
    const userId = userData!.data.userId;

    const fetchUsers = async () => {
        const totalUsers = await totalUsersInACollege(userId);
        setTot(totalUsers);
        const newUsers = await getUsersWithNoConnection(userId);
        setUsers(newUsers as OtherUsersDataForApp[]);
        setDataLoaded(true);
    };

    useEffect(() => {
        if (hydrated && userId && users.length < FETCH_THRESHOLD) {
            fetchUsers();
        }
    }, [hydrated, userId, users.length]);

    const handleSwipe = async (direction: string, swipedUserId: string) => {
        await neo4jSwipe(userId, direction, swipedUserId);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== swipedUserId));
        if (users.length <= FETCH_THRESHOLD) {
            fetchUsers();
        }
    };

    const handleNextImage = (event: React.MouseEvent, userId: string) => {
        event.stopPropagation();
        setCurrentImageIndices(prev => ({
            ...prev,
            [userId]: (prev[userId] + 1) % (users.find(u => u._id === userId)?.user_media?.length || 1)
        }));
    };

    const handlePrevImage = (event: React.MouseEvent, userId: string) => {
        event.stopPropagation();
        setCurrentImageIndices(prev => ({
            ...prev,
            [userId]: (prev[userId] - 1 + (users.find(u => u._id === userId)?.user_media?.length || 1)) % (users.find(u => u._id === userId)?.user_media?.length || 1)
        }));
    };

    const handleHeartClick = (userId: string, idx?: number) => {
        // TODO : figure out the way to get idx which is of img clicked and then send it to the backend , we have handled it i guess , but haven't tested it yet
        const cardRef = cardRefs.current[userId];
        if (cardRef) {
            cardRef.swipe('right');
        } else {
            console.error(`No reference found for user ID: ${userId}`);
        }
    };

    return (
        <main className="bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 min-h-screen">
            <NavBar />
            {users.length > 0 ? (
                <div className='relative pt-20 pb-10 flex justify-center items-center min-h-[calc(100vh-5rem)]'>
                    {users.map((user, index) => (
                        <TinderCard
                            ref={(ref: any) => cardRefs.current[user._id] = ref}
                            onSwipe={(direction) => handleSwipe(direction, user._id)}
                            className='absolute'
                            key={user._id}
                            preventSwipe={['up', 'down']}
                        >
                            <Card className='w-80 h-[30rem] sm:w-96 sm:h-[36rem] border-none shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-300 hover:scale-105'>
                                <div className='relative h-5/6 bg-gray-200'>
                                    {user.user_media && user.user_media.length > 0 && (
                                        <Image
                                            src={user.user_media[currentImageIndices[user._id] || 0].img_link}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            priority
                                            className='transition-opacity duration-300'
                                        />
                                    )}
                                    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                                        {user.user_media && user.user_media.map((_, imgIndex) => (
                                            <div
                                                key={imgIndex}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${imgIndex === (currentImageIndices[user._id] || 0) ? 'bg-white scale-125' : 'bg-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-300'
                                        onClick={(e) => handlePrevImage(e, user._id)}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-300'
                                        onClick={(e) => handleNextImage(e, user._id)}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                                <div className='h-1/6 bg-white p-4 flex flex-col justify-between'>
                                    <CardHeader className='p-0'>
                                        <CardTitle className='text-2xl font-bold text-gray-800'>{user.firstName} {user.lastName}</CardTitle>
                                        <CardDescription className='text-sm text-gray-600 line-clamp-2'>{user.user_desc}</CardDescription>
                                    </CardHeader>
                                </div>
                                <button
                                    className='absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-pink-100 transition-all duration-300 transform hover:scale-110'
                                    // onClick={() => handleHeartClick(user._id, idx)}
                                    onClick={() => handleHeartClick(user._id)}
                                >
                                    <Heart className='text-pink-500' size={24} />
                                </button>
                            </Card>
                        </TinderCard>
                    ))}
                </div>
            ) : (
                dataLoaded && (
                    <div className='flex items-center justify-center h-[calc(100vh-4rem)] text-center'>
                        <p className="text-xl text-gray-800 bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
                            {tot + ' ' + FEED_NO_USER}
                        </p>
                    </div>
                )
            )}
        </main>
    );
}