"use client";

import {
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    loginSchema,
    LoginRequest,
} from "@/types/auth";

import {
    signIn,
} from "next-auth/react";

import {
    useRouter,
} from "next/navigation";

export default function LoginPage() {
    const router =
        useRouter();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } =
        useForm<LoginRequest>({
            resolver:
                zodResolver(
                    loginSchema
                ),
        });

    async function onSubmit(
        data: LoginRequest
    ) {
        const result =
            await signIn(
                "credentials",
                {
                    email:
                        data.email,
                    password:
                        data.password,
                    redirect:
                        false,
                }
            );

        if (
            result?.error
        ) {
            alert(
                "Invalid credentials"
            );

            return;
        }

        router.push(
            "/dashboard"
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={handleSubmit(
                    onSubmit
                )}
                className="space-y-4 w-full max-w-md"
            >
                <h1 className="text-3xl font-bold">
                    Login
                </h1>

                <input
                    placeholder="Email"
                    className="border p-2 rounded w-full"
                    {...register(
                        "email"
                    )}
                />

                {errors.email && (
                    <p className="text-red-500">
                        {
                            errors.email
                                .message
                        }
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 rounded w-full"
                    {...register(
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

                <button
                    className="bg-black text-white p-2 rounded w-full"
                >
                    Login
                </button>
            </form>
        </main>
    );
}