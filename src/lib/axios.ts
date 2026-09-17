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

    const isUpload = typeof FormData !== "undefined" && config.data instanceof FormData;
    loadingBus.show(isUpload ? " Loading..." : undefined);

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
