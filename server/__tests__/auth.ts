import { PrismaClient } from "@prisma/client";
import { Axios, AxiosError } from "axios";
import { API } from "../__test_utils__/api";
import { cleanup } from "../__test_utils__/db";
import { TestUser } from "../__test_utils__/user";

const prisma = new PrismaClient();

beforeEach((done) => {
  cleanup();
  done();
});

it("can create a new user.", async () => {
  const response = await API.post("/auth/register", {
    email: "jamohile@gmail.com",
    password: "test",
    firstName: "Jay",
    lastName: "Mohile",
  });
  expect(response.status).toBe(201);
});

it("can login a user.", async () => {
  await API.post("/auth/register", {
    email: "jamohile@gmail.com",
    password: "test",
    firstName: "Jay",
    lastName: "Mohile",
  });

  const response = await API.post("/auth/login", {
    email: "jamohile@gmail.com",
    password: "test",
  });

  expect(response.status).toBe(200);
  expect(response.data.token).toBeTruthy();
});

it("can login a user regardless of password case.", async () => {
  await API.post("/auth/register", {
    email: "jamohile@gmail.com",
    password: "test",
    firstName: "Jay",
    lastName: "Mohile",
  });

  const response = await API.post("/auth/login", {
    email: "JaMohiLE@gmAIl.com",
    password: "test",
  });

  expect(response.status).toBe(200);
  expect(response.data.token).toBeTruthy();
});

it("can login a user regardless of spaces in email.", async () => {
  await API.post("/auth/register", {
    email: "jamohile@gmail.com",
    password: "test",
    firstName: "Jay",
    lastName: "Mohile",
  });

  const response = await API.post("/auth/login", {
    email: "jamohile@gmail.com  ",
    password: "test",
  });

  expect(response.status).toBe(200);
  expect(response.data.token).toBeTruthy();
});

it("does not login a user with wrong password.", async () => {
  await API.post("/auth/register", {
    email: "jamohile@gmail.com",
    password: "test",
    firstName: "Jay",
    lastName: "Mohile",
  });

  try {
    await API.post("/auth/login", {
      email: "jamohile@gmail.com",
      password: "incorrect",
    });
    fail();
  } catch (e) {
    expect((e as AxiosError).response?.status).toBe(401);
  }
});

it("does not allow creating a user with an existing email.", async () => {
  await API.post("/auth/register", {
    email: "jamohile@gmail.com",
    password: "test",
    firstName: "Jay",
    lastName: "Mohile",
  });

  try {
    await API.post("/auth/register", {
      email: "jamohile@gmail.com",
      password: "test",
      firstName: "Jay",
      lastName: "Mohile",
    });
    fail();
  } catch (e) {
    expect((e as AxiosError).response?.status).toBe(409);
  }
});

it("does not allow creating a user with an invalid email.", async () => {
  try {
    await API.post("/auth/register", {
      email: "foo",
      password: "test",
      firstName: "Jay",
      lastName: "Mohile",
    });
    fail();
  } catch (e) {
    expect((e as AxiosError).response?.status).toBe(400);
  }

  try {
    await API.post("/auth/register", {
      email: "fooexample.com",
      password: "test",
      firstName: "Jay",
      lastName: "Mohile",
    });
    fail();
  } catch (e) {
    expect((e as AxiosError).response?.status).toBe(400);
  }

  try {
    await API.post("/auth/register", {
      email: "a@b@example.com",
      password: "test",
      firstName: "Jay",
      lastName: "Mohile",
    });
    fail();
  } catch (e) {
    expect((e as AxiosError).response?.status).toBe(400);
  }

  try {
    await API.post("/auth/register", {
      email: "a@example.",
      password: "test",
      firstName: "Jay",
      lastName: "Mohile",
    });
    fail();
  } catch (e) {
    expect((e as AxiosError).response?.status).toBe(400);
  }
});

it("responds to auth verify from a logged in user.", async () => {
  const john = TestUser.fromName("john", "doe");
  await john.register();
  await john.login();
  const response = await john.api().get("/auth/verify");
  expect(response.status).toBe(200);
});

it("responds to auth verify from an unauthenticated user.", async () => {
  const john = TestUser.fromName("john", "doe");
  await john.register();
  try {
    await john.api().get("/auth/verify");
    fail();
  } catch (e) {
    expect((e as AxiosError).response?.status).toBe(401);
  }
});

it("responds to auth verify from a user with fake token.", async () => {
  const john = TestUser.fromName("john", "doe");
  await john.register();
  await john.login();

  try {
    await john.api().get("/auth/verify", {
      headers: {
        Authorization: "Bearer fakeToken",
      },
    });
    fail();
  } catch (e) {
    expect((e as AxiosError).response?.status).toBe(401);
  }
});
