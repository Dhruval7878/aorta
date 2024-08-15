"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { Neo4JUser } from '@/types';
import Link from 'next/link';
import React from 'react';

interface NavBarProps {
    currentUser: Neo4JUser;
}

const NavBar: React.FC<NavBarProps> = ({ currentUser }) => {
    return (
        <div className='p-8 bg-white/30 backdrop-blur-lg'>
            <nav className='flex items-center justify-between text-slate-700' aria-label="Main navigation">
                <div className='flex space-x-4'>
                    <Link href="/match" className="hover:text-slate-900">
                        Match
                    </Link>
                    <Link href="/" className="hover:text-slate-900">
                        Feed
                    </Link>
                    <Link href="/profile" className="hover:text-slate-900">
                        Profile
                    </Link>
                </div>
                <div className='flex items-center space-x-4'>
                    <span>{currentUser.firstname}</span>
                    <LogoutLink className="hover:text-slate-900">
                        Logout
                    </LogoutLink>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;