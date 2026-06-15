"use client";

import { useState } from "react";
import TransactionForm from "./transaction-form";

import TransactionTable from "./transaction-table";

import { SummaryCard } from "./summary-card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import type { TransactionResponse } from "@/types/transaction";

export function DashboardContent() {
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
    const { data, isLoading } = useDashboardStats();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <SummaryCard
                    title="Income"
                    amount={data?.income ?? 0}
                />

                <SummaryCard
                    title="Expense"
                    amount={data?.expense ?? 0}
                />

                <SummaryCard
                    title="Balance"
                    amount={data?.balance ?? 0}
                />
            </div>

            <TransactionForm
                selectedTransaction={selectedTransaction ?? undefined}
                onClear={() => setSelectedTransaction(null)}
            />
            <div className="h-8" />
            <TransactionTable onEdit={setSelectedTransaction} />
        </>
    );
}