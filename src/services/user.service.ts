import { UserRequest } from "@/types/user";

export const getUsers = async () => {
  const response = await fetch("api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const createUser = async (payload: UserRequest): Promise<unknown> => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed");

  return response.json();
};

export const updateUser = async (
  id: string,
  payload: UserRequest,
): Promise<unknown> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed");

  return response.json();
};
