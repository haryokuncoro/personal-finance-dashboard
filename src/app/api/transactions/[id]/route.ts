import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
