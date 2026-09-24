import axios from "axios";
import { authStorage } from "@/lib/auth-storage";
import { loadingBus } from "@/lib/loading-bus";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const auth = authStorage.get();

    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    // No text label — the animated 5Digea logo (hearts + wordmark) is the
    // loading indicator on its own.
    loadingBus.show();

    return config;
  },
  (error) => {
    loadingBus.hide();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    loadingBus.hide();
    return response;
  },
  (error) => {
    loadingBus.hide();
    return Promise.reject(error);
  }
);

export default api;
