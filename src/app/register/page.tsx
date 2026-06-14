"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    RegisterRequest,
    registerSchema,
} from "@/types/auth";

import { register } from "@/services/auth.service";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
    const router = useRouter();
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterRequest>({
        resolver:
            zodResolver(registerSchema),
    });

    async function onSubmit(
        data: RegisterRequest
    ) {
        try {
            await register(data);

            alert(
                "Register success"
            );
            router.push("/login");
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed"
            );
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

                <button
                    className="w-full rounded bg-black p-2 text-white"
                >
                    Register
                </button>
            </form>
        </main>
    );
}