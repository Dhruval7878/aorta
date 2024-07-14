import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { createUser, getUserByID } from "../neo4j.actions";

function extractCollegeName(email: string): string {
    const domain = email.split('@')[1];
    const collegeName = domain.split('.')[0];
    return collegeName;
}

export async function GET() {
    const { isAuthenticated, getUser } = getKindeServerSession();

    if (!(await isAuthenticated())) {
        return redirect(
            "/api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
        );
    }

    const user = await getUser();

    if (!user) {
        return redirect(
            "api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
        );
    }
    const dbUser = await getUserByID(user.id);

    if (!dbUser) {
        const collegeName = extractCollegeName(user.email!);
        await createUser({
            applicationID: user.id,
            email: user.email!,
            firstname: user.given_name!,
            lastname: user.family_name ?? undefined,
            collegeName ,
            preference: 2,
            gender: 2,
        });
    }
    return redirect("/");
}