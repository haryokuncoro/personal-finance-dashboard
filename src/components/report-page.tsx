"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getTransactions } from "@/services/transaction.service";
import type { TransactionResponse } from "@/types/transaction";
import ReportByCategory from "@/components/report-by-category"

export default function TransactionsReportPage() {
     
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [year, setYear] = useState<number | "all">("all");
    const [month, setMonth] = useState<number | "all">("all");

    useEffect(() => {
        setLoading(true);
        getTransactions()
            .then((data) => setTransactions(data))
            .catch((err) => setError(String(err)))
            .finally(() => setLoading(false));
    }, []);

    const years = useMemo(() => {
        const set = new Set<number>();
        transactions.forEach((t) => set.add(new Date(t.date).getFullYear()));
        return Array.from(set).sort((a, b) => b - a);
    }, [transactions]);

    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            const d = new Date(t.date);
            if (year !== "all" && d.getFullYear() !== year) return false;
            if (month !== "all" && d.getMonth() !== month) return false;
            return true;
        });
    }, [transactions, year, month]);

    return (
        <>
        <div className="p-6">
            

            <div className="flex gap-3 mb-4">
                <label className="flex items-center gap-2">
                    <span className="text-sm">Year</span>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}
                        className="border rounded p-1"
                    >
                        <option value="all">All</option>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex items-center gap-2">
                    <span className="text-sm">Month</span>
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value === "all" ? "all" : Number(e.target.value))}
                        className="border rounded p-1"
                    >
                        <option value="all">All</option>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={i}>
                                {new Date(0, i).toLocaleString(undefined, { month: "long" })}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}

            {!loading && !error && (
                <ReportByCategory transactions={filtered} />
            )}
        </div>
        </>
    );
}
