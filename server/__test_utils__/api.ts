import axios from "axios";

export const API = axios.create({
  baseURL: "http://0.0.0.0:3000",
});

export const API_AUTH = (token: string) =>
  axios.create({
    baseURL: "http://0.0.0.0:3000",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
