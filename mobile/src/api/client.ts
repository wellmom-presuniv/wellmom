import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: ganti ke base URL backend Alek (staging/production) begitu ready.
const BASE_URL = "http://172.20.10.2:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  console.log("🔑 Token di request interceptor:", token ? token.substring(0, 30) + "..." : "NULL");
  console.log("📍 URL:", config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
