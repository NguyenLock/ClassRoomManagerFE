import { GetAllLessonsResponse, CreateLessonPayload, AssignLessonPayload, AssignLessonResponse } from "../types";
import apiInstance from "./api";

const lessonManagementService = {
  getAllLessons: async (): Promise<GetAllLessonsResponse> => {
    try {
      const response = await apiInstance.get<GetAllLessonsResponse>(
        import.meta.env.VITE_GET_ALL_LESSONS
      );
      return response.data;
    } catch (error) {
      console.error("Error in getAllLessons:", error);
      throw error;
    }
  },

  createLesson: async (payload: CreateLessonPayload) => {
    try {
      const response = await apiInstance.post(
        import.meta.env.VITE_CREATE_LESSONS,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in createLesson:", error);
      throw error;
    }
  },

  assignLesson: async (payload: AssignLessonPayload): Promise<AssignLessonResponse> => {
    try {
      const response = await apiInstance.post(
        import.meta.env.VITE_ASSIGN_LESSON,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in assignLesson:", error);
      throw error;
    }
  },
};

export default lessonManagementService;
