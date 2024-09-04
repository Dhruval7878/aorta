"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Home, Star, MessageCircle, Heart, User, LucideDrumstick } from 'lucide-react';
import { cn } from "@/lib/utils";

const NavBar = () => {
    const pathname = usePathname();

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/standouts", icon: LucideDrumstick, label: "Standouts" }, // TODO chng this later
        { href: "/messages", icon: MessageCircle, label: "Messages" },
        { href: "/likes", icon: Heart, label: "Likes" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
            <div className="grid h-full grid-cols-5 mx-auto">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link 
                            key={href} 
                            href={href} 
                            className={cn(
                                "inline-flex flex-col items-center justify-center",
                            )}
                        >
                            <Icon 
                                className={cn(
                                    "w-6 h-6",
                                    isActive 
                                        ? "text-blue-500 dark:text-blue-400" 
                                        : "text-gray-500 dark:text-gray-400"
                                )} 
                                fill={isActive ? "currentColor" : "none"} 
                            />
                            <span className="sr-only">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default NavBar;