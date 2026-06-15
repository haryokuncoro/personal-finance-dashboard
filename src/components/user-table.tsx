"use client";

import { useUsers } from "@/hooks/use-users";
import { UserResponse } from "@/types/user";

type UserTableProps = {
    onEdit?: (user: UserResponse) => void;
};

export default function UserTable({ onEdit }: UserTableProps) {
    const {data, isLoading} = useUsers();

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
                        Name
                    </th>

                    <th>
                        Email
                    </th>

                    <th>
                        Action
                    </th>
                </tr>
            </thead>

            <tbody>
                {data?.map(
                    (
                        tx: UserResponse
                    ) => (
                        <tr
                            key={tx.id}
                        >
                            <td>
                                {
                                    tx.name
                                }
                            </td>

                            <td>
                                {
                                    tx.email
                                }
                            </td>


                            <td className="flex gap-2">
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={() => onEdit?.(tx)}
                                >
                                    Edit
                                </button>
                                
                            </td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}