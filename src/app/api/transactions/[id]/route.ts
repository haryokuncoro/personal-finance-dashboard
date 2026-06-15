import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/types/transaction";

export const PUT = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) => {
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

  const { id } = await params;
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

  const tx = await prisma.transaction.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!tx) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const transaction = await prisma.transaction.update({
    where: {
      id,
    },
    data: {
      ...validation.data,
      date: new Date(validation.data.date),
    },
  });

  return Response.json(transaction, {
    status: 200,
  });
};

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
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

  const { id } = await params;

  const tx = await prisma.transaction.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!tx) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.transaction.delete({
    where: {
      id,
    },
  });

  return Response.json({
    success: true,
  });
}
