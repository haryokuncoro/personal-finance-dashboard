import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { UsersContent } from "@/components/users-content";

const UsersPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-10">
        <UsersContent />
      </div>
    </>
  );
};

export default UsersPage;