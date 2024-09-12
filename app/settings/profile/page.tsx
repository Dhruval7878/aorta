"use client";

import Image from 'next/image';
import { FormEvent, useState, useCallback, useEffect } from 'react';
import { updateUserInDB } from '../../actions/user.actions';
import { useAppSelector } from '@/lib/store/hooks';
import { updateUser } from '@/lib/store/features/userSlice';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const userData = useAppSelector((state) => state.user.userData);
    const [firstName, setFirstname] = useState<string>('');
    const [lastName, setLastname] = useState<string>('');
    const [gender, setGender] = useState<number>(0);
    const [preference, setPreference] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [user_media, setUserMedia] = useState<string[]>([]);
    const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (userData?.data) {
            console.log('this is user data:', userData);
            setFirstname(userData.data.firstName);
            setLastname(userData.data.lastName);
            setGender(userData.data.gender);
            setPreference(userData.data.preference);
            setUserMedia(userData.data.user_media || []);
        }
    }, [userData]);

    const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingIndexes(prev => new Set(prev).add(index));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);

        const folder = `user_uploads/${userData.data!.userId}`;
        formData.append('folder', folder);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            setUserMedia(prev => {
                const newMedia = [...prev];
                newMedia[index] = result.secure_url;
                return newMedia;
            });

            toast({
                title: "Upload Successful",
                description: "Your image has been uploaded successfully.",
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                title: "Upload Failed",
                description: "There was an error uploading your image. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploadingIndexes(prev => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
            });
        }
    }, []);

    const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedData = {
                ...userData.data,
                firstName,
                lastName,
                gender,
                preference,
                user_media,
            };
            console.log('Updating with data:', updatedData);
            await updateUserInDB(updatedData);
            dispatch(updateUser(updatedData));
            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully"
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: "Update Failed",
                description: "There was an error updating your profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-white dark:bg-gray-900">
            <div className="flex-grow flex flex-col items-center justify-center w-full px-4 sm:max-w-md sm:mx-auto">
                <h1 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100 sm:text-2xl">Update Profile</h1>
                <form className="space-y-4 w-full" onSubmit={handleUpdateProfile}>
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
                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <label
                                key={index}
                                htmlFor={`image-${index}`}
                                className="cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center h-24 overflow-hidden relative"
                            >
                                {user_media[index] ? (
                                    <Image
                                        src={user_media[index].img_link}
                                        alt={`Image ${index}`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        priority
                                    />
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400">Upload Image</span>
                                )}
                                <input
                                    type="file"
                                    id={`image-${index}`}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, index)}
                                    disabled={uploadingIndexes.has(index)}
                                />
                                {uploadingIndexes.has(index) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white">Uploading...</span>
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
