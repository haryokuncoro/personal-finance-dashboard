import { auth } from "@/auth";

import { redirect } from "next/navigation";

import DashboardContent from "@/components/dashboard-content";

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
        <div className="max-w-5xl mx-auto p-10">
            <h1 className="text-3xl font-bold mb-6">
                Personal Finance Dashboard
            </h1>

            <p className="mb-6">
                Welcome{" "}
                {
                    session.user?.name
                }
            </p>

            <DashboardContent />
        </div>
    );
}