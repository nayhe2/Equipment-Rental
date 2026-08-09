import axios from 'axios';

// Tworzymy naszą globalną instancję Axiosa
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Adres Twojego backendu w Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR (Magia): Przed każdym wysłaniem żądania sprawdź, czy mamy token w localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Jeśli token istnieje, dołącz go automatycznie do nagłówka Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;