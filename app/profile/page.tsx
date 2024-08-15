'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { updateUser } from '../neo4j.actions';
import NavBar from '../components/NavBar';
import { redirect } from 'next/navigation';

export default function ProfilePage() {
    const { currentUser, loading } = useAuth();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState(2);
    const [preference, setPreference] = useState(2);

    useEffect(() => {
        if (currentUser) {
            setFirstname(currentUser.firstname || '');
            setLastname(currentUser.lastname || '');
            setGender(currentUser.gender || 2);
            setPreference(currentUser.preference || 2);
        }
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback');
        return null;
    }

    const handleUpdateProfile = async () => {
        try {
            await updateUser({
                ...currentUser,
                firstname,
                lastname,
                gender,
                preference,
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div>
            <NavBar currentUser={currentUser} />
            <h1>Update Profile</h1>
            <div>
                <label>First Name:</label>
                <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            </div>
            <div>
                <label>Last Name:</label>
                <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            </div>
            <div>
                <label>Gender:</label>
                <select value={gender} onChange={(e) => setGender(Number(e.target.value))}>
                    <option value={2}>Select Gender</option>
                    <option value={0}>Male</option>
                    <option value={1}>Female</option>
                </select>
            </div>
            <div>
                <label>Preference:</label>
                <select value={preference} onChange={(e) => setPreference(Number(e.target.value))}>
                    <option value={2}>Select Preference</option>
                    <option value={0}>Male</option>
                    <option value={1}>Female</option>
                </select>
            </div>
            <button onClick={handleUpdateProfile}>Update Profile</button>
        </div>
    );
}