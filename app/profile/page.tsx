import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { getUserByID } from '../neo4j.actions';
import ProfilePageClientComponent from './ProfilePage';

const authenticator = async () => {
    const { isAuthenticated, getUser } = getKindeServerSession();
    
    if (!(await isAuthenticated())) {
        redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback');
    }

    const user = await getUser();

    if (!user) {
        redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback');
    }

    const currentUser = await getUserByID(user.id);

    if (!currentUser) {
        redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback');
        return null;
    }

    if (currentUser.gender === 2 || currentUser.preference === 2) {
        redirect('/profile');
    }

    const plainCurrentUser = JSON.parse(JSON.stringify(currentUser));

    return <ProfilePageClientComponent currentUser={plainCurrentUser} />;
};

export default authenticator;
