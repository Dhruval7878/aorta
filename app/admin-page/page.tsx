'use client'

import React, { FormEvent, useState } from 'react';
import { deleteUserByUserId, createUser } from '../actions/admin.actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import mongoose from 'mongoose';

const Admin = () => {
    const [uid, setUid] = useState('');
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        collegeId: '',
        dob: '',
        gender: '',
        preference: '',
        user_desc: '',
        clerk_id: ''
    });
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleDeleteUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await deleteUserByUserId(uid);
            setMessage({ type: res.success ? 'success' : 'error', content: res.message });
        } catch (error: any) {
            setMessage({ type: 'error', content: error.message || 'Error deleting user' });
        }
    };

    const handleCreateUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const newData = {
                ...userData,
                collegeId: new mongoose.Types.ObjectId(userData.collegeId),
                gender: parseInt(userData.gender),
                preference: parseInt(userData.preference),
                dob: new Date(userData.dob)
            }
            const res = await createUser(newData);
            setMessage({ type: res.success ? 'success' : 'error', content: res.message });
        } catch (error: any) {
            setMessage({ type: 'error', content: error.message || 'Error creating user' });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="p-4 dark:bg-gray-800 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {message.content && (
                <Alert className={`mb-4 ${message.type === 'error' ? 'bg-red-100 dark:bg-red-800' : 'bg-green-100 dark:bg-green-800'}`}>
                    <AlertDescription>{message.content}</AlertDescription>
                </Alert>
            )}

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Delete User</h2>
                <form onSubmit={handleDeleteUser} className="flex gap-2">
                    <input
                        type="text"
                        value={uid}
                        onChange={(e) => setUid(e.target.value)}
                        placeholder="User ID"
                        className="border p-2 rounded dark:bg-gray-700 dark:text-white"
                    />
                    <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Delete User</button>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Create User</h2>
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="text"
                        name="collegeId"
                        value={userData.collegeId}
                        onChange={handleInputChange}
                        placeholder="College ID"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="date"
                        name="dob"
                        value={userData.dob}
                        onChange={handleInputChange}
                        placeholder="Date of Birth"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="text"
                        name="gender"
                        value={userData.gender}
                        onChange={handleInputChange}
                        placeholder="Gender"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="text"
                        name="preference"
                        value={userData.preference}
                        onChange={handleInputChange}
                        placeholder="Preference"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    />
                    <textarea
                        name="user_desc"
                        value={userData.user_desc}
                        onChange={handleInputChange}
                        placeholder="User Description"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create User</button>
                </form>
            </div>
        </div>
    );
};

export default Admin;