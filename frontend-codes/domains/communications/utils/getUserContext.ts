import { prisma } from "@/lib/db";
import { CommunicationUserContext } from "../types/user-context";

export async function getUserContext(userId: string): Promise<CommunicationUserContext> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error(`[Communications] User not found: ${userId}`);
  }

  const name = user.name || "Builder";
  const parts = name.split(" ");

  return {
    id: user.id,
    name,
    email: user.email,
    firstName: parts[0] || "Builder",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
  };
}