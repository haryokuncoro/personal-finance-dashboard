"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createTransaction,
    updateTransaction,
} from "@/services/transaction.service";
import {
    transactionSchema,
    type TransactionRequest,
    type TransactionResponse,
} from "@/types/transaction";

type FieldErrors = Partial<Record<string, string>>;

type TransactionFormProps = {
    selectedTransaction?: TransactionResponse;
    onClear?: () => void;
};

const defaultFormState = () => {
    const today = new Date().toISOString().split("T")[0];

    return {
        id: "",
        description: "",
        category: "",
        amount: "",
        type: "EXPENSE" as const,
        date: today,
    };
};

export default function TransactionForm({
    selectedTransaction,
    onClear,
}: TransactionFormProps) {
    const queryClient = useQueryClient();
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formState, setFormState] = useState(defaultFormState);

    useEffect(() => {
        if (selectedTransaction) {
            setFormState({
                id: selectedTransaction.id,
                description: selectedTransaction.description,
                category: selectedTransaction.category,
                amount: selectedTransaction.amount.toString(),
                type: selectedTransaction.type,
                date: selectedTransaction.date.split("T")[0],
            });
            return;
        }

        setFieldErrors({});
        setFormState(defaultFormState());
    }, [selectedTransaction]);

    const isEditing = Boolean(formState.id);

    const mutation = useMutation({
        mutationFn: async ({
            payload,
            id,
        }: {
            payload: TransactionRequest;
            id?: string;
        }) => {
            if (id) {
                return updateTransaction(id, payload);
            }

            return createTransaction(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            setFormState(defaultFormState());
            setFieldErrors({});
            onClear?.();
        },
    });

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFieldErrors({});

        const result = transactionSchema.safeParse({
            description: formState.description,
            category: formState.category,
            amount: Number(formState.amount),
            type: formState.type,
            date: formState.date,
        });

        if (!result.success) {
            const flat = result.error.flatten().fieldErrors;
            setFieldErrors(
                Object.fromEntries(
                    Object.entries(flat).map(([k, v]) => [k, v?.[0]])
                )
            );
            return;
        }

        try {
            await mutation.mutateAsync({
                payload: result.data,
                id: formState.id || undefined,
            });
        } catch {
            // mutation-level error (network, server, etc.) is on mutation.error
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">
                    {isEditing ? "Edit Transaction" : "Add Transaction"}
                </h2>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            setFormState(defaultFormState());
                            setFieldErrors({});
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
                    name="description"
                    placeholder="Description"
                    value={formState.description}
                    onChange={(event) =>
                        setFormState((prev) => ({
                            ...prev,
                            description: event.target.value,
                        }))
                    }
                    className="border p-2 w-full"
                />
                {fieldErrors.description && (
                    <p className="text-red-500 text-sm">{fieldErrors.description}</p>
                )}
            </div>

            <div>
                <input
                    name="category"
                    placeholder="Category"
                    value={formState.category}
                    onChange={(event) =>
                        setFormState((prev) => ({
                            ...prev,
                            category: event.target.value,
                        }))
                    }
                    className="border p-2 w-full"
                />
                {fieldErrors.category && (
                    <p className="text-red-500 text-sm">{fieldErrors.category}</p>
                )}
            </div>

            <div>
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formState.amount}
                    onChange={(event) =>
                        setFormState((prev) => ({
                            ...prev,
                            amount: event.target.value,
                        }))
                    }
                    className="border p-2 w-full"
                />
                {fieldErrors.amount && (
                    <p className="text-red-500 text-sm">{fieldErrors.amount}</p>
                )}
            </div>

            <div>
                <select
                    name="type"
                    value={formState.type}
                    onChange={(event) =>
                        setFormState((prev) => ({
                            ...prev,
                            type: event.target.value as "INCOME" | "EXPENSE",
                        }))
                    }
                    className="border p-2 w-full"
                >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
                {fieldErrors.type && (
                    <p className="text-red-500 text-sm">{fieldErrors.type}</p>
                )}
            </div>

            <div>
                <input
                    type="date"
                    name="date"
                    value={formState.date}
                    onChange={(event) =>
                        setFormState((prev) => ({
                            ...prev,
                            date: event.target.value,
                        }))
                    }
                    className="border p-2 w-full"
                />
                {fieldErrors.date && (
                    <p className="text-red-500 text-sm">{fieldErrors.date}</p>
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