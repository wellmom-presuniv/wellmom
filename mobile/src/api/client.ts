import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: ganti ke base URL backend Alek (staging/production) begitu ready.
<<<<<<< HEAD
// Prefix /api/v1 — sesuai main.py: app.include_router(api_router, prefix="/api/v1")
const BASE_URL = "http://localhost:8000/api/v1";
=======
const BASE_URL = "http://<IP-laptop-kamu>:8000/api/v1";
>>>>>>> main

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
