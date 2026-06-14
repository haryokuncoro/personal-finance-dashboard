import {
    auth,
} from "@/auth";

import {
    redirect,
} from "next/navigation";
import LogoutButton from "@/components/logout-button";
export default async function DashboardPage() {
    const session =
        await auth();

    if (
        !session
    ) {
        redirect(
            "/login"
        );
    }

    return (

        <div className="p-10">
            <h1 className="text-3xl font-bold">
                Dashboard
            </h1>
            <LogoutButton />

            <p>
                Welcome{" "}
                {
                    session.user?.name
                }
            </p>
        </div>
    );
}