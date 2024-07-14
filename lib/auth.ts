// lib/auth.js
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserByID } from '../app/neo4j.actions';

export const authenticateUser = async () => {
    const { isAuthenticated, getUser } = getKindeServerSession();
    if (!(await isAuthenticated())) {
        return { redirectUrl: '/api/auth/login?post_login_redirect_url=http://localhost:3000/callback' };
    }

    const user = await getUser();

    if (!user) {
        return { redirectUrl: '/api/auth/login?post_login_redirect_url=http://localhost:3000/callback' };
    }

    const currentUser = await getUserByID(user.id);

    return { currentUser };
};
