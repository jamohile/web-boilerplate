import { PrismaClient } from "@prisma/client";
import type { FastifyPluginCallback } from "fastify";
import fastify from "fastify";
import validator from "validator";

import { getHash, getToken, isValid, makeToken } from "../auth";

const prisma = new PrismaClient();

const routes: FastifyPluginCallback = (app, opts, done) => {
  app.post<{ Body: { email: string; password: string } }>(
    "/login",
    async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send();
      }

      const user = await prisma.user.findFirst({
        where: {
          email: {
            equals: email.trim(),
            mode: "insensitive",
          },
        },
      });
      if (!user) {
        return res.status(404).send();
      }

      const valid = await isValid(password, user!.hash);
      if (!valid) {
        return res.status(401).send();
      }

      // Login is valid, generate a token.
      const token = makeToken(user!.id);

      return res.status(200).send({
        token,
      });
    }
  );

  app.post<{
    Body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };
  }>("/register", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).send();
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send();
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      return res.status(409).send();
    }

    await prisma.user.create({
      data: {
        email: email.trim(),
        hash: await getHash(password),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    });

    return res.status(201).send();
  });

  app.get("/verify", async (req, res) => {
    const token = getToken(req);
    if (!token) {
      return res.status(401).send();
    }
    return res.status(200).send();
  });

  done();
};
export default routes;
