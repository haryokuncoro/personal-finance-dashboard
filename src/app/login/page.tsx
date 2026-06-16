"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginRequest } from "@/types/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NotificationState } from "@/types/notification.state";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [notification, setNotification] = useState<NotificationState>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginRequest) {
        setNotification(null);

        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            setNotification({ type: "error", message: "Invalid credentials" });
            return;
        }

        setNotification({ type: "success", message: "Login success" });
        setTimeout(() => router.push("/dashboard"), 1500);
    }

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md space-y-4"
            >
                <h1 className="text-3xl font-bold">Login</h1>

                {/* Notification Banner */}
                {notification && (
                    <div
                        className={`flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${notification.type === "success"
                            ? "border-green-200 bg-green-50 text-green-800"
                            : "border-red-200 bg-red-50 text-red-800"
                            }`}
                    >
                        <span>{notification.message}</span>
                        <button
                            type="button"
                            onClick={() => setNotification(null)}
                            className="ml-4 font-bold opacity-60 hover:opacity-100"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <input
                    placeholder="Email"
                    className="w-full rounded border p-2"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded border p-2"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                )}

                <div className="space-y-2">
                    <button
                        type="submit"
                        className="w-full rounded bg-black p-2 text-white"
                    >
                        Login
                    </button>
                    <div className="flex items-center">
                        <hr className="flex-1 border-gray-300" />
                        <span className="px-3 text-sm text-gray-500">or</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>
                    <Link
                        href="/register"
                        className="block w-full rounded border p-2 text-center"
                    >
                        Register
                    </Link>
                </div>
            </form>
        </main>
    );
}