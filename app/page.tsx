import withAuth from './withAuth';
import { getUsersWithNoConnection } from './neo4j.actions';
import HomePageClientComponent from './components/Home';
import NavBar from './components/NavBar';
import { Neo4JUser } from '@/types';

const Home = async ({ currentUser }: { currentUser: Neo4JUser }) => {
    const usersWithNoConnection = await getUsersWithNoConnection(currentUser.applicationID);
    const plainCurrentUser = JSON.parse(JSON.stringify(currentUser));

    return (
        <main className=''>
            <NavBar currentUser={plainCurrentUser} />
            {usersWithNoConnection.length === 0 ? (
                <p>0 users for now, come back later. {currentUser.collegeName}</p>
            ) : (
                <HomePageClientComponent currentUser={plainCurrentUser} users={usersWithNoConnection} />
            )}
        </main>
    );
};

export default withAuth(Home);
