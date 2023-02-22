import fastify from "fastify";

export const app = fastify({ logger: true });

import authRoutes from "./routes/auth";

app.register(authRoutes, { prefix: "/auth" });
