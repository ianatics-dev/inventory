import axios from "axios";
import { logoutAndRedirect } from "./auth";

const URL: string = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000/";

const app = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

app.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

app.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      logoutAndRedirect();
    }
    return Promise.reject(error);
  }
);

export default app;