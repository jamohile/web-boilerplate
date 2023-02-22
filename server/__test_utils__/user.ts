import { PrismaClient } from "@prisma/client";
import axios, { Axios } from "axios";
import child_process from "child_process";
import { API, API_AUTH } from "./api";

const prisma = new PrismaClient();

export class TestUser {
  public email: string;
  public password: string;
  public firstName: string;
  public lastName: string;

  token?: string;

  constructor(
    email: string,
    password: string = "test",
    firstName: string = "",
    lastName: string = ""
  ) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  async register() {
    this.token = undefined;

    await API.post("/auth/register", {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }

  async login() {
    const response = await API.post("/auth/login", {
      email: this.email,
      password: this.password,
    });
    this.token = response.data.token;
  }

  // TODO: this should be api based.
  async id() {
    const user = await prisma.user.findFirst({
      where: { email: this.email },
    });
    return user!.id;
  }

  api() {
    return API_AUTH(this.token!);
  }

  static fromName(firstName: string, lastName: string) {
    return new TestUser(
      `${firstName}@example.com`,
      "test",
      firstName,
      lastName
    );
  }
}
