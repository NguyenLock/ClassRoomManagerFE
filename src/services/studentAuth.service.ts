import {
  AccessCodeValidationRequest,
  SetupAccountRequest,
  StudentAuthResponse,
  StudentLoginRequest,
  GetAllInstructorsResponse
} from "../types";
import apiInstance from "./api";

const studentAuthService = {
  setupAccount: async (
    verificationToken: string,
    data: SetupAccountRequest
  ) => {
    try {
      const response = await apiInstance.post(
        `${import.meta.env.VITE_SETUP_ACCOUNT}/${verificationToken}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error setting up account:", error);
      throw error;
    }
  },

  login: async (data: StudentLoginRequest): Promise<StudentAuthResponse> => {
    const response = await apiInstance.post(import.meta.env.VITE_STUDENT_LOGIN, data);
    return response.data;
  },

  validateAccessCode: async (
    data: AccessCodeValidationRequest
  ): Promise<StudentAuthResponse> => {
    const response = await apiInstance.post(
      import.meta.env.VITE_ACCESS_CODE_STUDENT,
      data
    );
    return response.data;
  },

  getAllInstructors: async (): Promise<GetAllInstructorsResponse> => {
    try {
      const response = await apiInstance.get(
        import.meta.env.VITE_GET_ALL_INSTRUCTOR
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { studentAuthService };
