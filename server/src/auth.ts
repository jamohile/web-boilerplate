import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { FastifyRequest } from "fastify";

interface AuthToken {
  id: number;
}

export function getToken(req: FastifyRequest): AuthToken | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return undefined;
  }

  const tokenString = authHeader.split("Bearer ")[1];

  try {
    const token = jwt.verify(
      tokenString,
      process.env.JWT_SECRET!
    ) as unknown as AuthToken;

    return token;
  } catch (err) {
    return undefined;
  }
}

export function makeToken(userId: number): string {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!);
  return token;
}

export async function isValid(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function getHash(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
