import { AUTH_SIGN_IN_ROUTE, AUTH_SIGN_UP_ROUTE } from '@/lib/constants';
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
    publicRoutes: [AUTH_SIGN_IN_ROUTE, AUTH_SIGN_UP_ROUTE, "/images(.*)", "/favicon.ico"],

})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};