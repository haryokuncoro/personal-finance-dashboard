"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { useTransactions } from "@/hooks/use-transactions";

import {
    deleteTransaction,
} from "@/services/transaction.service";
import { TransactionResponse } from "@/types/transaction";

export default function TransactionTable() {
    const queryClient =
        useQueryClient();

    const {
        data,
        isLoading,
    } =
        useTransactions();

    const mutation =
        useMutation({
            mutationFn:
                deleteTransaction,

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

    if (isLoading) {
        return (
            <p>
                Loading...
            </p>
        );
    }

    return (
        <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
                <tr>
                    <th>
                        Description
                    </th>

                    <th>
                        Category
                    </th>

                    <th>
                        Amount
                    </th>

                    <th>
                        Type
                    </th>

                    <th>
                        Action
                    </th>
                </tr>
            </thead>

            <tbody>
                {data?.map(
                    (
                        tx: TransactionResponse
                    ) => (
                        <tr
                            key={tx.id}
                        >
                            <td>
                                {
                                    tx.description
                                }
                            </td>

                            <td>
                                {
                                    tx.category
                                }
                            </td>

                            <td>
                                {
                                    tx.amount
                                }
                            </td>

                            <td>
                                {tx.type}
                            </td>

                            <td>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() =>
                                        mutation.mutate(
                                            tx.id
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}