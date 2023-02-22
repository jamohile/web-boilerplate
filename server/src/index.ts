import { app } from "./app";

async function main() {
  await app.listen({
    port: parseInt(process.env.PORT || "3000"),
    host: process.env.HOST || "0.0.0.0",
  });
}

main();