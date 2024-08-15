'use server'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserByID } from './neo4j.actions';

export async function getAuthenticatedUser() {
    const { isAuthenticated, getUser } = getKindeServerSession();

    if (!(await isAuthenticated())) {
        return null;
    }

    const user = await getUser();

    if (!user) {
        return null;
    }

    const currentUser = await getUserByID(user.id);
    return currentUser;
}