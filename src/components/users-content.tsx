"use client";

import { useState } from "react";
import UserForm from "./user-form";
import UserTable from "./user-table";
import type { UserResponse } from "@/types/user";

export function UsersContent() {
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

    return (
        <>
            <UserForm
                selectedUser={selectedUser ?? undefined}
                onClear={() => setSelectedUser(null)}
            />
            <br />
            <div className="flex justify-between items-center mb-8">
                <UserTable onEdit={setSelectedUser} />
            </div>
        </>
    );
}
