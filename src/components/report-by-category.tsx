"use client";

import React, { useMemo } from "react";
import type { TransactionResponse } from "@/types/transaction";

type Props = {
    transactions: TransactionResponse[];
};

function formatCurrency(n: number) {
    return n.toLocaleString(undefined, { style: "currency", currency: "IDR" });
}

export default function ReportByCategory({ transactions }: Props) {
    const summary = useMemo(() => {
        const byCategory: Record<string, { total: number; count: number }> = {};
        let income = 0;
        let expense = 0;

        transactions.forEach((t) => {
            const amt = t.type === "EXPENSE" ? -t.amount : t.amount;

            if (!byCategory[t.category]) byCategory[t.category] = { total: 0, count: 0 };
            byCategory[t.category].total += amt;
            byCategory[t.category].count += 1;

            if (t.type === "EXPENSE") expense += t.amount;
            else income += t.amount;
        });

        const categories = Object.entries(byCategory).map(([category, data]) => ({ category, ...data }));

        categories.sort((a, b) => b.total - a.total);

        return { income, expense, categories };
    }, [transactions]);

    return (
        <div>
            
               <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="p-3 border rounded">
                    <div className="text-xl text-gray-600">Income</div>
                    <div className="text-xl font-medium">{formatCurrency(summary.income)}</div>
                </div>
                <div className="p-3 border rounded">
                    <div className="text-xl text-gray-600">Expense</div>
                    <div className="text-xl font-medium">{formatCurrency(summary.expense)}</div>
                </div>
                <div className="p-3 border rounded">
                    <div className="text-xl text-gray-600">Net</div>
                    <div className="text-xl font-medium">{formatCurrency(summary.income - summary.expense)}</div>
                </div>
            </div>

            <div className="border rounded">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-2">Category</th>
                            <th className="text-right p-2">Total</th>
                            <th className="text-right p-2">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.categories.map((c) => (
                            <tr key={c.category} className="border-t">
                                <td className="p-2">{c.category}</td>
                                <td className="p-2 text-right">{formatCurrency(c.total)}</td>
                                <td className="p-2 text-right">{c.count}</td>
                            </tr>
                        ))}
                        {summary.categories.length === 0 && (
                            <tr>
                                <td className="p-4" colSpan={3}>
                                    No transactions for selection
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
