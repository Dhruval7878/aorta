'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Neo4JUser } from '@/types';
import { getAuthenticatedUser } from './auth.actions';

interface AuthContextType {
    currentUser: Neo4JUser | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<Neo4JUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const user = await getAuthenticatedUser();
                if (!user) {
                    redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback');
                }
                setCurrentUser(user);
            } catch (error) {
                console.error('Error during authentication:', error);
                redirect('');
            } finally {
                setLoading(false);
            }
        };
        authenticateUser();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}