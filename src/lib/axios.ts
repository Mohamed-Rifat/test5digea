import axios from "axios";
import { authStorage } from "@/lib/auth-storage";
import { loadingBus } from "@/lib/loading-bus";
import { getLanguageSnapshot } from "@/lib/i18n";

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

    // Tell the API which language the user is reading, so any text it sends
    // back (notifications, messages) can be localized server-side.
    config.headers["Accept-Language"] = getLanguageSnapshot();

    if (!(config as typeof config & { skipGlobalLoader?: boolean }).skipGlobalLoader) {
      loadingBus.show();
    }

    return config;
  },
  (error) => {
    if (!(error.config as (typeof error.config & { skipGlobalLoader?: boolean }) | undefined)?.skipGlobalLoader) {
      loadingBus.hide();
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (!(response.config as typeof response.config & { skipGlobalLoader?: boolean }).skipGlobalLoader) {
      loadingBus.hide();
    }
    return response;
  },
  (error) => {
    const config = error.config as (typeof error.config & { skipGlobalLoader?: boolean }) | undefined;
    if (!config?.skipGlobalLoader) {
      loadingBus.hide();
    }

    if (error?.response?.status === 401 && authStorage.get()?.token) {
      authStorage.remove();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
