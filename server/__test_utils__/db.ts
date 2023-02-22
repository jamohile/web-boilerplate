import child_process from "child_process";

/** Cleanup the database between tests. */
export function cleanup() {
  child_process.execSync("prisma migrate reset --force");
}
