'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonalInfoData, PersonalInfoSchema } from '@/db/schema/auth.schema';
import { DOB, FEMALE, FIRST_NAME, GENDER, LAST_NAME, MALE, MIN_ALLOWED_DATE, NEXT, PREFERENCE } from '@/lib/constants';

interface PersonalInfoFormProps {
    onSubmit: (data: PersonalInfoData) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<PersonalInfoData>({
        resolver: zodResolver(PersonalInfoSchema)
    });

    const handleFormSubmit: SubmitHandler<PersonalInfoData> = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <label htmlFor="firstName" className="block mb-2">{FIRST_NAME}</label>
                <input id="firstName" {...register('firstName')} className="w-full p-2 border rounded" />
                {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
            </div>
            <div>
                <label htmlFor="lastName" className="block mb-2">{LAST_NAME}</label>
                <input id="lastName" {...register('lastName')} className="w-full p-2 border rounded" />
                {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
            </div>
            <div>
                <label htmlFor="dob" className="block mb-2">{DOB}</label>
                <input
                    id="dob"
                    {...register('dob')}
                    className="w-full p-2 border rounded"
                    type="date"
                    max={MIN_ALLOWED_DATE}
                    required
                />
                {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
            </div>
            <div>
                <label htmlFor="gender" className="block mb-2">{GENDER}</label>
                <select id="gender" {...register('gender')} className="w-full p-2 border rounded">
                    <option value="0">{MALE}</option>
                    <option value="1">{FEMALE}</option>
                </select>
                {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
            </div>
            <div>
                <label htmlFor="preference" className="block mb-2">{PREFERENCE}</label>
                <select id="preference" {...register('preference')} className="w-full p-2 border rounded">
                    <option value="0">{MALE}</option>
                    <option value="1">{FEMALE}</option>
                </select>
                {errors.preference && <p className="text-red-500">{errors.preference.message}</p>}
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">{NEXT}</button>
        </form>
    );
};

export default PersonalInfoForm;