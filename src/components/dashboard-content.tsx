"use client";

import TransactionForm from "./transaction-form";

import TransactionTable from "./transaction-table";

export default function DashboardContent() {
    return (
        <div className="space-y-8">
            <TransactionForm />

            <TransactionTable />
        </div>
    );
}