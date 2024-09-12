'use client';

import OtpForm from './OtpForm';
import React, { useState } from 'react';
import { createUser } from '@/app/actions/user.actions';
import { useRouter } from 'next/navigation';
import { formatErrorCode } from '@/lib/utils';
import CredentialsForm from './CredentialsForm';
import PersonalInfoForm from './PersonalInfoForm';
import { useSignUp, useClerk } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';
import { PersonalInfoData, CredentialsData } from '@/db/schema/auth.schema';
import { COMPLETE, ERROR_CREATING_USER, ERROR_TITLE, FAILED_CREATING_USER } from '@/lib/constants';
import mongoose from 'mongoose';

const MultiStepRegistrationForm = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [personalInfo, setPersonalInfo] = useState<PersonalInfoData | null>(null);
    const [credentials, setCredentials] = useState<CredentialsData | null>(null);
    const { signUp, isLoaded, setActive } = useSignUp();
    const { signOut } = useClerk();
    const [loading, setLoading] = useState(false);

    const handlePersonalInfoSubmit = (data: PersonalInfoData) => {
        setPersonalInfo(data);
        setStep(2);
    };

    const handleCredentialsSubmit = async (data: CredentialsData) => {
        if (!isLoaded) return;

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setCredentials({ email: data.email, password: 'null' });
            setStep(3);
        } catch (error: any) {
            handleError(error);
        }
    };

    const handleOtpSubmit = async (otp: string) => {
        if (!isLoaded) return;
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: otp,
            });
            if (completeSignUp.status === COMPLETE) {
                await setActive({ session: completeSignUp.createdSessionId });
                const userData = {
                    email: credentials!.email,
                    firstName: personalInfo!.firstName,
                    lastName: personalInfo!.lastName,
                    gender: personalInfo!.gender == "0" ? 0 : 1,
                    preference: personalInfo!.preference == "0" ? 0 : 1,
                    dob: new Date(personalInfo!.dob),
                    clerk_id: completeSignUp.createdUserId!,
                    user_desc: '',
                    user_matches: [],
                    user_media: [],
                    collegeId: new mongoose.Types.ObjectId('b3b3b3b3b3b3b3b3b3b3b3b3'),
                };
                try {
                    await createUser(userData);
                    await signOut();
                    setLoading(false);
                    toast({
                        title: "Success",
                        description: "User created successfully , please login to continue",
                    });
                    router.push('/auth/sign-in');
                } catch (error) {
                    setLoading(false);
                    console.error(ERROR_CREATING_USER, error);
                    toast({
                        title: ERROR_TITLE,
                        description: FAILED_CREATING_USER,
                        variant: 'destructive',
                    });
                }
            } else {
                setLoading(false);
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (error: any) {
            setLoading(false);
            handleError(error);
        }
    };

    const handleError = (error: any) => {
        if (error.errors && error.errors.length > 0) {
            const errorCode = formatErrorCode(error.errors[0].code);
            const errorMessage = error.errors[0].longMessage;
            toast({
                title: errorCode,
                description: errorMessage,
                variant: 'destructive',
            });
        } else {
            toast({
                title: ERROR_TITLE,
                description: 'An unexpected error occurred',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-4">
            {step === 1 && <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />}
            {step === 2 && <CredentialsForm onSubmit={handleCredentialsSubmit} />}
            {step === 3 && <OtpForm onSubmit={handleOtpSubmit} />}
        </div>
    );
};

export default MultiStepRegistrationForm;