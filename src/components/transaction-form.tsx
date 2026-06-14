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
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        const form = e.currentTarget; 
        const formData = new FormData(form);
        const parsed = transactionSchema.parse({
            description: formData.get("description"),
            category: formData.get("category"),
            amount: Number(formData.get("amount")),
            type: formData.get("type"),
            date: formData.get("date"),
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
                placeholder="Description"
                className="border p-2 w-full"
            />

            <input
                name="category"
                placeholder="Category"
                className="border p-2 w-full"
            />

            <input
                type="number"
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

            <button className="bg-black text-white px-4 py-2 rounded">
                Add Transaction
            </button>
        </form>
    );
}