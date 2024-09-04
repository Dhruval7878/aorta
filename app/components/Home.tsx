"use client";

import * as React from 'react';
import { Neo4JUser } from '@/db/schema/user.neo';
import TinderCard from 'react-tinder-card';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { neo4jSwipe } from '../actions/user.actions';
import { MATCH_ALERT } from '../../lib/constants';

interface HomePageClientComponentProps {
    currentUser: Neo4JUser;
    users: Neo4JUser[];
}

const HomePageClientComponent: React.FC<HomePageClientComponentProps> = ({ currentUser, users }) => {
    const handleSwipe = async (direction: string, userId: string) => {
        const isMatch = await neo4jSwipe(currentUser.userId, direction, userId);
        if (isMatch)
            alert(MATCH_ALERT);
    }

    return (
        <div className='relative'>
            {users.map((user) => (
                <TinderCard onSwipe={(direction) => { handleSwipe(direction, user.userId) }} className='absolute grid place-content-center h-screen m-6 w-screen' key={user.userId}>
                    <Card className='w-80 h-[32rem] border-slate-200 hover:shadow-xl flex flex-col justify-between'>
                        <div className='flex-grow'>
                            <img src='next.svg' alt={`${user.firstName} ${user.lastName}`} className='w-full h-full object-cover' />
                        </div>
                        <div className='border-t border-slate-200 p-4'>
                            <CardHeader className='flex flex-col items-start'>
                                <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                                <CardDescription>"{user.email}"</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </TinderCard>
            ))}
        </div>
    );
};

export default HomePageClientComponent;
