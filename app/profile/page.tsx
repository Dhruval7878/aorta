"use client";
import { useState } from 'react';
import NavBar from '../components/NavBar';
import { updateUserInDB } from '../actions/user.actions';
import { useAppSelector } from '@/lib/store/hooks';
import { updateUser } from '@/lib/store/features/userSlice';
import { toast } from '@/components/ui/use-toast';

const ProfilePage = () => {
    const userData = useAppSelector((state) => state.user.userData);
    const [firstName, setFirstname] = useState(userData.data!.firstName);
    const [lastName, setLastname] = useState(userData.data!.lastName);
    const [gender, setGender] = useState(userData.data!.gender);
    const [preference, setPreference] = useState(userData.data!.preference);

    const handleUpdateProfile = async () => {
        await updateUserInDB({
            ...userData.data,
            firstName,
            lastName,
            gender,
            preference,
        });
        updateUser({ ...userData.data, firstName, lastName, gender, preference });
        toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully",
            duration: 5000
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-white dark:bg-gray-900">
            <NavBar />
            <div className="flex-grow flex flex-col items-center justify-center w-full px-4 sm:max-w-md sm:mx-auto">
                <h1 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100 sm:text-2xl">Update Profile</h1>
                <form className="space-y-4 w-full">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-base">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstname(e.target.value)}
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-base">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastname(e.target.value)}
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-base">Gender:</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(Number(e.target.value))}
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:border-blue-500"
                        >
                            <option disabled>Select Gender</option>
                            <option value={0}>Male</option>
                            <option value={1}>Female</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="preference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-base">Preference:</label>
                        <select
                            id="preference"
                            value={preference}
                            onChange={(e) => setPreference(Number(e.target.value))}
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:border-blue-500"
                        >
                            <option disabled>Select Preference</option>
                            <option value={0}>Male</option>
                            <option value={1}>Female</option>
                        </select>
                    </div>
                    <button
                        onClick={handleUpdateProfile}
                        className="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
