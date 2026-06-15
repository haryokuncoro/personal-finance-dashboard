import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { userSchema } from "@/types/user";

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
  const validation = userSchema.safeParse(body);

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

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!user) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const { name, email, password } = validation.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser && existingUser.id !== id) {
    return Response.json(
      {
        message: "Email already exists",
      },
      {
        status: 409,
      },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return Response.json(
    {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
    {
      status: 200,
    },
  );
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

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!user) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  return Response.json({ message: "Deleted" }, { status: 200 });
}
