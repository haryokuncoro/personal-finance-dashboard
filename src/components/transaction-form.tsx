"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { createTransaction } from "@/services/transaction.service";
import { transactionSchema } from "@/types/transaction";


export default function TransactionForm() {
    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({
            mutationFn:
                createTransaction,

            onSuccess: () => {
                queryClient.invalidateQueries(
                    {
                        queryKey: [
                            "transactions",
                        ],
                    }
                );
            },
        });

    async function handleSubmit(
        e: React.SyntheticEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const today = new Date().toISOString().split("T")[0];
        const parsed = transactionSchema.parse({
            description: formData.get("description"),
            category: formData.get("category"),
            amount: Number(formData.get("amount")),
            type: formData.get("type"),
            date: formData.get("date") || today,
        });


        await mutation.mutateAsync(parsed);

        form.reset();
    }

    return (
        <form
            onSubmit={
                handleSubmit
            }
            className="space-y-2 border p-4 rounded"
        >
            <input
                name="description"
                required
                placeholder="Description"
                className="border p-2 w-full"
            />

            <input
                name="category"
                required
                placeholder="Category"
                className="border p-2 w-full"
            />

            <input
                type="number"
                required
                name="amount"
                placeholder="Amount"
                className="border p-2 w-full"
            />

            <select
                name="type"
                className="border p-2 w-full"
            >
                <option value="EXPENSE">
                    Expense
                </option>

                <option value="INCOME">
                    Income
                </option>
            </select>

            <input
                type="date"
                name="date"
                className="border p-2 w-full"
            />

            <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                Add Transaction
            </button>
        </form>
    );
}