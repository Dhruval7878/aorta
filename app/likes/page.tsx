'use client'

import React, { useEffect, useState } from 'react';
import { connectionWithLikes, handleLikesPageAction, neo4jSwipe } from '../actions/user.actions';
import { useAppSelector } from '@/lib/store/hooks';
import { OtherUsersDataForApp } from '@/db/schema/types';
import NavBar from '../components/NavBar';

const LikesPage = () => {
    const userData = useAppSelector((state) => state.user.userData);
    const userId = userData?.data?.userId;
    const [users, setUsers] = useState<OtherUsersDataForApp[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            handleFetch();
        }
    }, [userId]);

    const handleFetch = async () => {
        try {
            const fetchedUsers = await connectionWithLikes(userId);
            if (fetchedUsers.length === 0) {
                console.log('No users found who like this user.');
            } else {
                console.log('Fetched users:', fetchedUsers);
            }
            setUsers(fetchedUsers);
            setDataLoaded(true);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoadingError('Failed to load data. Please try again.');
        }
    };

    const handleAccept = (likedUserId: string) => {
        handleLikesPageAction(userId, 'right', likedUserId);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== likedUserId));
    };

    const handleReject = (rejectedUserId: string) => {
        handleLikesPageAction(userId, 'left', rejectedUserId);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== rejectedUserId));
    };

    if (loadingError) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="flex-grow flex items-center justify-center">
                    <div className="error-message text-red-500">{loadingError}</div>
                </div>
                <NavBar />
            </div>
        );
    }

    if (!dataLoaded) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="flex-grow flex items-center justify-center">
                    <div className="loading-message">Loading...</div>
                </div>
                <NavBar />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-800 dark:text-white">
            <div className="flex-grow">
                <h1 className="text-2xl font-bold m-4">Likes Page</h1>
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.user_desc}</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                                        onClick={() => handleAccept(user._id)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                                        onClick={() => handleReject(user._id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>No users have liked you yet.</p>
                    </div>
                )}
            </div>
            <NavBar />
        </div>
    );
};

export default LikesPage;