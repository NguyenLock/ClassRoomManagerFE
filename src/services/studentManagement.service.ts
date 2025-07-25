import { GetAllStudentsResponse, UpdateStudentData, GetStudentDetailResponse} from "../types";
import apiInstance from "./api";

const studentManagementService = {
  getAllStudents: async (): Promise<GetAllStudentsResponse> => {
    try {
      const response = await apiInstance.get(
        import.meta.env.VITE_GET_ALL_STUDENT
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addStudent: async (email: string) => {
    try {
      const response = await apiInstance.post(
        import.meta.env.VITE_ADD_STUDENT,
        { email }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteStudent: async (email: string) => {
    try {
      const response = await apiInstance.delete(
        import.meta.env.VITE_DELETE_STUDENT.replace(":email", email)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editStudent: async (currentEmail: string, data: UpdateStudentData) => {
    try {
      const response = await apiInstance.put(
        import.meta.env.VITE_EDIT_STUDENT.replace(":email", currentEmail),
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentDetail: async (email: string): Promise<GetStudentDetailResponse> => {
    try {
      const response = await apiInstance.get<GetStudentDetailResponse>(
        import.meta.env.VITE_GET_DETAIL_STUDENT.replace(":email", email)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default studentManagementService;
