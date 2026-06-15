"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, updateUser } from "@/services/user.service";
import {
    userSchema,
    type UserRequest,
    type UserResponse,
} from "@/types/user";

type UserFormProps = {
    selectedUser?: UserResponse;
    onClear?: () => void;
};

const defaultFormState = (): UserRequest => ({
    name: "",
    email: "",
    password: "",
});

export default function UserForm({
    selectedUser,
    onClear,
}: UserFormProps) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserRequest>({
        resolver: zodResolver(userSchema),
        defaultValues: defaultFormState(),
    });

    useEffect(() => {
        if (selectedUser) {
            reset({
                name: selectedUser.name,
                email: selectedUser.email,
                password: "",
            });
            return;
        }

        reset(defaultFormState());
    }, [selectedUser, reset]);

    const isEditing = Boolean(selectedUser?.id);

    const mutation = useMutation({
        mutationFn: async (payload: UserRequest) => {
            if (selectedUser?.id) {
                return updateUser(selectedUser.id, payload);
            }

            return createUser(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            reset(defaultFormState());
            onClear?.();
        },
    });

    const onSubmit: SubmitHandler<UserRequest> = async (payload) => {
        try {
            await mutation.mutateAsync(payload);
        } catch {
            // mutation error is surfaced via mutation.error
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 border p-4 rounded">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">
                    {isEditing ? "Edit User" : "Add User"}
                </h2>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            reset(defaultFormState());
                            onClear?.();
                        }}
                        className="text-sm text-blue-600"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <div>
                <input
                    placeholder="Name"
                    className="border p-2 w-full"
                    {...register("name")}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
            </div>

            <div>
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
            </div>

            {mutation.error && (
                <p className="text-red-500 text-sm">
                    Failed to save: {(mutation.error as Error).message}
                </p>
            )}

            <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {mutation.isPending
                    ? isEditing
                        ? "Updating..."
                        : "Saving..."
                    : isEditing
                        ? "Update User"
                        : "Add User"}
            </button>
        </form>
    );
}
