import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { userSchema } from "@/types/user";

export const GET = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
  return Response.json(users);
};

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

  const { name, email, password } = validation.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
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

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return Response.json(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    {
      status: 201,
    },
  );
}
