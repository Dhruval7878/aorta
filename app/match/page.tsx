'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { getMatches } from '../neo4j.actions';
import NavBar from '../components/NavBar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Neo4JUser } from '@/types';
import { redirect } from 'next/navigation';

export default function MatchPage() {
    const { currentUser, loading } = useAuth();
    const [matches, setMatches] = useState<Neo4JUser[]>([]);

    useEffect(() => {
        if (currentUser) {
            const fetchMatches = async () => {
                const fetchedMatches = await getMatches(currentUser.applicationID);
                setMatches(fetchedMatches);
            };
            fetchMatches();
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
        <main>
            <NavBar currentUser={currentUser} />
            {matches.length === 0 ? (
                <p>No matches found</p>
            ) : (
                matches.map((user) => (
                    <Card className='w-96 border-slate-200 hover:shadow-xl' key={user.applicationID}>
                        <CardHeader>
                            <CardTitle className=''>{user.firstname} {user.lastname}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </CardHeader>
                    </Card>
                ))
            )}
        </main>
    );
}