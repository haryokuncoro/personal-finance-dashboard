interface SummaryCardProps {
    title: string;
    amount: number;
}

export function SummaryCard({
    title,
    amount,
}: SummaryCardProps) {
    return (
        <div className="rounded-lg border p-6 bg-white shadow-sm">
            <h3 className="text-sm text-gray-500">
                {title}
            </h3>

            <p className="mt-2 text-3xl font-bold">
                Rp {amount.toLocaleString()}
            </p>
        </div>
    );
}