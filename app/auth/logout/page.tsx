'use client';

import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { toast } from '@/components/ui/use-toast';
import { AUTH_SIGN_IN_ROUTE, LOGOUT_DISC, SIGN_OUT_BUTTON, SUCCESS_TITLE } from '@/lib/constants';
import { useAppDispatch } from '@/lib/store/hooks';
import { clearUser } from '@/lib/store/features/userSlice';

export default function SignOutButton() {
    const dispatch = useAppDispatch();
    dispatch(clearUser());
    const router = useRouter();
    const { signOut } = useClerk();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast({
                title: SUCCESS_TITLE,
                description: LOGOUT_DISC,
            });
            router.push(AUTH_SIGN_IN_ROUTE);
        } catch (error: any) {
            toast({
                title: error.errors[0]?.code || 'Error',
                description: error.errors[0]?.longMessage || 'An error occurred',
                variant: 'destructive',
            });
        }
    };

    return (
        <button onClick={handleSignOut}>{SIGN_OUT_BUTTON}</button>
    );
}
