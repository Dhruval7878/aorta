'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CredentialsData, CredentialsSchema } from '@/db/schema/auth.schema';
import { FORM_EMAIL, FORM_PASSWORD, SIGN_UP_BUTTON } from '@/lib/constants';

interface CredentialsFormProps {
    onSubmit: (data: CredentialsData) => void;
}

const CredentialsForm: React.FC<CredentialsFormProps> = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CredentialsData>({
        resolver: zodResolver(CredentialsSchema)
    });

    const handleFormSubmit: SubmitHandler<CredentialsData> = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <label htmlFor="email" className="block mb-2">{FORM_EMAIL}</label>
                <input id="email" type="email" {...register('email')} className="w-full p-2 border rounded" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="password" className="block mb-2">{FORM_PASSWORD}</label>
                <input id="password" type="password" {...register('password')} className="w-full p-2 border rounded" />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">{SIGN_UP_BUTTON}</button>
        </form>
    );
};

export default CredentialsForm;