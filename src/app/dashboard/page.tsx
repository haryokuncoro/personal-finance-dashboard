import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { DashboardContent } from "@/components/dashboard-content";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-5xl mx-auto p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Personal Finance Dashboard
          </h1>

          <p>
            Welcome {session.user?.name}
          </p>
        </div>

        <LogoutButton />
      </div>

      <DashboardContent />
    </div>
  );
}