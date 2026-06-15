import { TransactionRequest } from "@/types/transaction";


export async function getTransactions() {
  const response = await fetch("/api/transactions");

  if (!response.ok) {
    throw new Error("Failed");
  }

  return response.json();
}
export async function createTransaction(payload: TransactionRequest): Promise<unknown> {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed");

  return response.json();
}

export const updateTransaction = async (id:string, payload: TransactionRequest): Promise<unknown> => {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed");

  return response.json();
}


export async function deleteTransaction(id: string) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed");
  }
}

