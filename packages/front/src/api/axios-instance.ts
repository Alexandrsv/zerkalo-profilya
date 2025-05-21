import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://feedback.zbc.su"
    : "https://tunnel2.zbc.su/";
// : "http://localhost:3005";

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    auth: window.location.search.slice(1),
  },
});

export interface IError {
  message: string;
  statusCode: number;
  error: string;
}
