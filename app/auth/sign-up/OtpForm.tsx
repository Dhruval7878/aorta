'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OtpData, OtpSchema } from '@/db/schema/auth.schema';
import { ENTER_OTP, VERIFY_BUTTON } from '@/lib/constants';

interface OtpFormProps {
    onSubmit: (otp: string) => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<OtpData>({
        resolver: zodResolver(OtpSchema)
    });

    const handleFormSubmit: SubmitHandler<OtpData> = (data) => {
        onSubmit(data.otp);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <label htmlFor="otp" className="block mb-2">{ENTER_OTP}</label>
                <input id="otp" {...register('otp')} className="w-full p-2 border rounded" />
                {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">{VERIFY_BUTTON}</button>
        </form>
    );
};

export default OtpForm;