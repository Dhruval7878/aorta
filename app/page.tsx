'use client'

import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { getUsersWithNoConnection } from './neo4j.actions';
import HomePageClientComponent from './components/Home';
import NavBar from './components/NavBar';
import { Neo4JUser } from '@/types';
import { redirect } from 'next/navigation';

export default function Home() {
    const { currentUser, loading } = useAuth();
    const [usersWithNoConnection, setUsersWithNoConnection] = useState<Neo4JUser[]>([]);

    useEffect(() => {
        if (currentUser) {
            const fetchUsers = async () => {
                const users = await getUsersWithNoConnection(currentUser.applicationID);
                setUsersWithNoConnection(users);
            };
            fetchUsers();
        }
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback');
        return null;
    }

    return (
        <main className=''>
            <NavBar currentUser={currentUser} />
            {usersWithNoConnection.length === 0 ? (
                <p>0 users for now, come back later. {currentUser.collegeName}</p>
            ) : (
                <HomePageClientComponent currentUser={currentUser} users={usersWithNoConnection} />
            )}
        </main>
    );
}