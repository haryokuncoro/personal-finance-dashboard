import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "./logout-button";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold">
          Finance Tracker
        </Link>

        {session ? (
           <div className="flex gap-4">
            <Link href="/users" className="rounded border px-4 py-2">
              Users
            </Link>
            <Link href="/dashboard" className="rounded bg-black px-4 py-2 text-white">
              transaction
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="rounded border px-4 py-2">
              Login
            </Link>
            <Link href="/register" className="rounded bg-black px-4 py-2 text-white">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}