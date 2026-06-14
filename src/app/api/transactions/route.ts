import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { transactionSchema } from "@/types/transaction";


export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },

    orderBy: {
      date: "desc",
    },
  });

  return Response.json(transactions);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const body = await request.json();

  const validation = transactionSchema.safeParse(body);

  if (!validation.success) {
    return Response.json(
      {
        message: "Validation failed",
      },
      {
        status: 400,
      },
    );
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...validation.data,

      date: new Date(validation.data.date),

      userId: session.user.id,
    },
  });

  return Response.json(transaction, {
    status: 201,
  });
}
