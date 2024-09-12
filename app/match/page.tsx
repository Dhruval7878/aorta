'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/store/hooks';
import { getMatches } from '../actions/user.actions';
import { NO_MATCHES_FOUND } from '../../lib/constants';
import NavBar from '../components/NavBar';
import { UserCircle, MessageCircle } from 'lucide-react';
import { OtherUsersDataForApp } from '@/db/schema/types';
import { toast } from '@/components/ui/use-toast';

const MatchPage = () => {
    const [matches, setMatches] = useState<OtherUsersDataForApp[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const userData = useAppSelector((state) => state.user.userData);
    const userId = userData?.data.userId;

    useEffect(() => {
        const fetchMatches = async () => {
            const fetchedMatches = await getMatches(userId);
            setMatches(fetchedMatches);
            setDataLoaded(true);
        };
        fetchMatches();
    }, [userId]);


    // TODO : do this , this is chat section , things needs to be fixed over here
    const handleMessageClick = (matchId: string) => {
        toast({
            title: 'Feature not implemented',
            description: `Navigate to chat with user ${matchId}`,
        })
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <main className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Matches</h1>
                {dataLoaded && matches.length === 0 ? (
                    <Card className="bg-white shadow-md">
                        <CardContent className="flex items-center justify-center h-32">
                            <p className="text-gray-500 text-lg">{NO_MATCHES_FOUND}</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map((user) => (
                            <Card
                                key={user._id}
                                className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                onClick={() => handleMessageClick(user._id)}
                            >
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <UserCircle className="h-12 w-12 text-gray-400" />
                                    <div className="flex-grow">
                                        <CardTitle className="text-xl font-semibold text-gray-800">
                                            {user.firstName} {user.lastName}
                                        </CardTitle>
                                        {/* // TODO : Add last message here , this will look good i guess and additionally if prev message does not exist then we show it something like "Time to start a new convo" */}
                                        <CardDescription className="text-sm text-gray-500">
                                            Time to start a conversation
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMessageClick(user._id);
                                        }}
                                    >
                                        <MessageCircle className="h-6 w-6" />
                                    </Button>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MatchPage;