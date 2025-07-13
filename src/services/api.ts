import axios from "axios";

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SECRET,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const finalToken = token.startsWith("Bearer") ? token : `Bearer ${token}`;
      config.headers.Authorization = finalToken;
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
