import { cleanup } from "../__test_utils__";

it("works", async () => {
  cleanup();
  expect(true).toBe(true);
})