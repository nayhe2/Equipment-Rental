import axios from "axios";

// Tworzymy naszą globalną instancję Axiosa

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR przed każdym wysłaniem żądania sprawdza, czy jest token w localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
