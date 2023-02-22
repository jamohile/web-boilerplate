import { app } from "./app";

async function main() {
  const port = process.env.PORT || "3000";
  const host = process.env.HOST || "0.0.0.0";

  console.log(`Starting server on http://${host}:${port}`);

  await app.listen({
    port: parseInt(port),
    host: host
  });
}

main();