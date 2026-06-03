import axios from "axios";

const NETWORK_ERROR_MESSAGE = "TutorGround API is not reachable. Please make sure the backend is running, then try again.";

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof Error) return error.message;
  return fallback;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  withCredentials: true,
  timeout: 15000
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message = error.response?.data?.error || (error.request ? NETWORK_ERROR_MESSAGE : error.message) || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export async function getData<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await api.get(path);
    return response.data.data as T;
  } catch {
    return fallback;
  }
}
