'use client'

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SignInFormData, UserLoginSchema } from '@/db/schema/auth.schema';
import { useToast } from '@/components/ui/use-toast';
import { formatErrorCode } from '@/lib/utils';
import { COMPLETE, SUCCESS_TITLE, SUCCESS_LOGIN_MESSAGE, ERROR_TITLE, TWO_OR_MORE_ERRORS, SIGN_IN_BUTTON, FORM_EMAIL, FORM_PASSWORD } from '@/lib/constants';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/store/features/userSlice';
import { getUserData } from '@/app/actions/user.actions';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const SignInPage = () => {
    const dispatch = useDispatch();
    const { signIn, isLoaded, setActive } = useSignIn();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
        resolver: zodResolver(UserLoginSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: SignInFormData) => {
        if (!isLoaded) return;

        try {
            setLoading(true);
            const response = await signIn.create({
                identifier: data.email,
                password: data.password,
            });

            if (response.status === COMPLETE) {
                await setActive({ session: response.createdSessionId });
                try {
                    const data = await getUserData(response.identifier!);
                    dispatch(setUser(data))
                    toast({
                        title: SUCCESS_TITLE,
                        description: SUCCESS_LOGIN_MESSAGE,
                    });
                    setLoading(false);
                    router.push('/');
                } catch (error) {
                    setLoading(false);
                    console.error(error);
                }
            }
        } catch (error: any) {
            setLoading(false);
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
                    description: TWO_OR_MORE_ERRORS,
                    variant: 'destructive',
                });
            }
        }
    };

    const getErrorMessage = (error: any): string => {
        return typeof error === 'string' ? error : error?.message || 'An error occurred';
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Sign In</CardTitle>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-400">Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">{FORM_EMAIL}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                {...register('email')}
                                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {errors.email && (
                                <Alert variant="destructive">
                                    <AlertDescription>{getErrorMessage(errors.email)}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">{FORM_PASSWORD}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...register('password')}
                                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {errors.password && (
                                <Alert variant="destructive">
                                    <AlertDescription>{getErrorMessage(errors.password)}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                SIGN_IN_BUTTON
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default SignInPage;