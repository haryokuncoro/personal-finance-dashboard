import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(1),

  category: z.string().min(1),

  amount: z.number().positive(),

  type: z.enum(["INCOME", "EXPENSE"]),

  date: z.string(),
});

export const transactionResponseSchema = transactionSchema.extend({
  id: z.string(),
});

export type TransactionRequest = z.infer<typeof transactionSchema>;
export type TransactionResponse = z.infer<typeof transactionResponseSchema>;
