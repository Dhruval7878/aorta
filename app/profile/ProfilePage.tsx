"use client"

import { Neo4JUser } from '@/types';
import { updateUser } from '../neo4j.actions';
import { useState } from 'react';
import NavBar from '../components/NavBar';

const ProfilePageClientComponent = ({ currentUser }: { currentUser: Neo4JUser }) => {
    const [firstname, setFirstname] = useState(currentUser.firstname);
    const [lastname, setLastname] = useState(currentUser.lastname || '');
    const [gender, setGender] = useState(currentUser.gender);
    const [preference, setPreference] = useState(currentUser.preference);

    const handleUpdateProfile = async () => {
        await updateUser({
            ...currentUser,
            firstname,
            lastname,
            gender,
            preference,
        });
        alert('Profile updated successfully!');
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
};

export default ProfilePageClientComponent;
