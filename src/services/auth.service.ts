import { AuthMeResponse } from "../types";
import apiInstance from "./api";

const authService = {
  getMe: async (): Promise<AuthMeResponse> => {
    const response = await apiInstance.get(import.meta.env.VITE_AUTH_ME);
    return response.data.data;
  },
};

export default authService;
