"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "@/services/transaction.service";
import { transactionSchema } from "@/types/transaction";

type FieldErrors = Partial<Record<string, string>>;

export default function TransactionForm() {
    const queryClient = useQueryClient();
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const mutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setFieldErrors({});

        const form = e.currentTarget;
        const formData = new FormData(form);
        const today = new Date().toISOString().split("T")[0];

        // Use safeParse instead of parse to avoid throwing
        const result = transactionSchema.safeParse({
            description: formData.get("description"),
            category: formData.get("category"),
            amount: Number(formData.get("amount")),
            type: formData.get("type"),
            date: formData.get("date") || today,
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
            await mutation.mutateAsync(result.data);
            form.reset();
        } catch {
            // mutation-level error (network, server, etc.) is on mutation.error
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded">
            <div>
                <input
                    name="description"
                    placeholder="Description"
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
                    className="border p-2 w-full"
                />
                {fieldErrors.amount && (
                    <p className="text-red-500 text-sm">{fieldErrors.amount}</p>
                )}
            </div>

            <div>
                <select name="type" className="border p-2 w-full">
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
                {fieldErrors.type && (
                    <p className="text-red-500 text-sm">{fieldErrors.type}</p>
                )}
            </div>

            <div>
                <input type="date" name="date" className="border p-2 w-full" />
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
                {mutation.isPending ? "Saving..." : "Add Transaction"}
            </button>
        </form>
    );
}