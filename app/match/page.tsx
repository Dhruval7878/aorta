"use client";

import * as React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Neo4JUser } from '@/db/schema/user.neo';
import NavBar from '../components/NavBar';
import { NO_MATCHES_FOUND } from '../../lib/constants';
import { getMatches } from '../actions/user.actions';

const MatchPageClientComponent = ({ currentUser }: { currentUser: Neo4JUser }) => {
    const [matches, setMatches] = React.useState<Neo4JUser[]>([]);

    React.useEffect(() => {
        const fetchMatches = async () => {
            const fetchedMatches = await getMatches(currentUser.userId);
            setMatches(fetchedMatches);
        };
        fetchMatches();
    }, [currentUser]);

    return (
        <main className=''>
            {matches.length === 0 ? (
                <p>{NO_MATCHES_FOUND}</p>
            ) : (
                matches.map((user) => (
                    <Card className='w-96 border-slate-200 hover:shadow-xl' key={user.userId}>
                        <CardHeader>
                            {/* <CardTitle className=''>{user.firstname} {user.lastname}</CardTitle> */}
                            <CardDescription>{user.email}</CardDescription>
                        </CardHeader>
                    </Card>
                ))
            )}
        </main>
    );
};

export default MatchPageClientComponent;
