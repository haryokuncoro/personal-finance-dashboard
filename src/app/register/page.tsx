"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
    RegisterRequest,
    registerSchema,
} from "@/types/auth";

import { register } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { NotificationState } from "@/types/notification.state";

export default function RegisterPage() {
    const router = useRouter();
    const [notification, setNotification] = useState<NotificationState>(null);

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterRequest>({
        resolver:
            zodResolver(registerSchema),
    });

    async function onSubmit(data: RegisterRequest) {
        setNotification(null);
        try {
            await register(data);
            setNotification({ type: "success", message: "Register success" });
            setTimeout(() => router.push("/login"), 1500);
        } catch (error) {
            setNotification({
                type: "error",
                message: error instanceof Error ? error.message : "Failed",
            });
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={handleSubmit(
                    onSubmit
                )}
                className="w-full max-w-md space-y-4"
            >
                <h1 className="text-3xl font-bold">
                    Register
                </h1>
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
                    placeholder="Name"
                    className="w-full rounded border p-2"
                    {...registerField("name")}
                />

                {errors.name && (
                    <p className="text-red-500">
                        {
                            errors.name.message
                        }
                    </p>
                )}

                <input
                    placeholder="Email"
                    className="w-full rounded border p-2"
                    {...registerField("email")}
                />

                {errors.email && (
                    <p className="text-red-500">
                        {
                            errors.email.message
                        }
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded border p-2"
                    {...registerField(
                        "password"
                    )}
                />

                {errors.password && (
                    <p className="text-red-500">
                        {
                            errors.password
                                .message
                        }
                    </p>
                )}
                <div className="space-y-2">
                    <button
                        className="w-full rounded bg-black p-2 text-white"
                    >
                        Register
                    </button>
                    <div className="flex items-center">
                        <hr className="flex-1 border-gray-300" />
                        <span className="px-3 text-sm text-gray-500">or</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>
                    <Link
                        href="/login"
                        className="block w-full rounded border p-2 text-center"
                    >
                        Login
                    </Link>
                </div>

            </form>
        </main>
    );
}