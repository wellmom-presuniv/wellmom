import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: ganti ke base URL backend Alek (staging/production) begitu ready.
const BASE_URL = "http://10.8.10.237:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      // Token expired saat app aktif — paksa logout ke Login
      const { useAuthStore } = await import("../store/useAuthStore");
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
