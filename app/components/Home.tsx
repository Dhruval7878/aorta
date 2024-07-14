"use client";
import * as React from 'react';
import { Neo4JUser } from '@/types';
import TinderCard from 'react-tinder-card';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { neo4jSwipe } from '../neo4j.actions';

interface HomePageClientComponentProps {
    currentUser: Neo4JUser;
    users: Neo4JUser[];
}

const HomePageClientComponent: React.FC<HomePageClientComponentProps> = ({ currentUser, users }) => {
    const handleSwipe = async (direction: string, userId: string) => {
        const isMatch = await neo4jSwipe(currentUser.applicationID, direction, userId);
        if (isMatch)
            alert("It's a match!");
    }
    return (
        <div className=''>
            <div className='relative'>
                {users.length === 0 ? (
                    <p>No users for now, come back later</p>
                ) : (
                    users.map((user) => (
                        <TinderCard onSwipe={(direction) => { handleSwipe(direction, user.applicationID) }} className='absolute grid place-content-center h-screen m-6 w-screen' key={user.applicationID}>
                            <Card className='w-80 h-[32rem] border-slate-200 hover:shadow-xl flex flex-col justify-between'>
                                {/* Image placeholder */}
                                <div className='flex-grow'>
                                    <img src='/path/to/user/photo.jpg' alt={`${user.firstname} ${user.lastname}`} className='w-full h-full object-cover' />
                                </div>
                                {/* Text content */}
                                <div className='border-t border-slate-200 p-4'>
                                    <CardHeader className='flex flex-col items-start'>
                                        <CardTitle>{user.firstname} {user.lastname}</CardTitle>
                                        <CardDescription>"{user.email}"</CardDescription>
                                    </CardHeader>
                                </div>
                            </Card>
                        </TinderCard>
                    ))
                )}
            </div>
        </div>
    );
}

export default HomePageClientComponent;
