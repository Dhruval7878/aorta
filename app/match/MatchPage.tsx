"use client";

import * as React from 'react';
import { getMatches } from '../neo4j.actions';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Neo4JUser } from '@/types';
import NavBar from '../components/NavBar';

const MatchPageClientComponent = ({ currentUser }: { currentUser: Neo4JUser }) => {
    const [matches, setMatches] = React.useState<Neo4JUser[]>([]);

    React.useEffect(() => {
        const fetchMatches = async () => {
            const fetchedMatches = await getMatches(currentUser.applicationID);
            setMatches(fetchedMatches);
        };
        fetchMatches();
    }, [currentUser]);

    return (
        <main className=''>
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
};

export default MatchPageClientComponent;
