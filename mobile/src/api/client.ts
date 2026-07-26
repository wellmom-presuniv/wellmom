import axios, { type AxiosRequestHeaders } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://172.20.10.2:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? ({} as AxiosRequestHeaders);
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
