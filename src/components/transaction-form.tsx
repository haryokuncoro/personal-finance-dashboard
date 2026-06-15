"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createTransaction,
    updateTransaction,
} from "@/services/transaction.service";
import {
    transactionSchema,
    type TransactionRequest,
    type TransactionResponse,
} from "@/types/transaction";

type TransactionFormProps = {
    selectedTransaction?: TransactionResponse;
    onClear?: () => void;
};

const defaultFormState = (): TransactionRequest => {
    const today = new Date().toISOString().split("T")[0];

    return {
        description: "",
        category: "",
        amount: 0,
        type: "EXPENSE",
        date: today,
    };
};

export default function TransactionForm({
    selectedTransaction,
    onClear,
}: TransactionFormProps) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TransactionRequest>({
        resolver: zodResolver(transactionSchema),
        defaultValues: defaultFormState(),
    });

    useEffect(() => {
        if (selectedTransaction) {
            reset({
                description: selectedTransaction.description,
                category: selectedTransaction.category,
                amount: selectedTransaction.amount,
                type: selectedTransaction.type,
                date: selectedTransaction.date.split("T")[0],
            });
            return;
        }

        reset(defaultFormState());
    }, [selectedTransaction, reset]);

    const isEditing = Boolean(selectedTransaction?.id);

    const mutation = useMutation({
        mutationFn: async (payload: TransactionRequest) => {
            if (selectedTransaction?.id) {
                return updateTransaction(selectedTransaction.id, payload);
            }

            return createTransaction(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            reset(defaultFormState());
            onClear?.();
        },
    });

    const onSubmit: SubmitHandler<TransactionRequest> = async (payload) => {
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
                    {isEditing ? "Edit Transaction" : "Add Transaction"}
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
                    placeholder="Description"
                    className="border p-2 w-full"
                    {...register("description")}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
            </div>

            <div>
                <input
                    placeholder="Category"
                    className="border p-2 w-full"
                    {...register("category")}
                />
                {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category.message}</p>
                )}
            </div>

            <div>
                <input
                    type="number"
                    placeholder="Amount"
                    className="border p-2 w-full"
                    {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                    <p className="text-red-500 text-sm">{errors.amount.message}</p>
                )}
            </div>

            <div>
                <select className="border p-2 w-full" {...register("type")}>
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
                {errors.type && (
                    <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
            </div>

            <div>
                <input
                    type="date"
                    className="border p-2 w-full"
                    {...register("date")}
                />
                {errors.date && (
                    <p className="text-red-500 text-sm">{errors.date.message}</p>
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
                        ? "Update Transaction"
                        : "Add Transaction"}
            </button>
        </form>
    );
}
