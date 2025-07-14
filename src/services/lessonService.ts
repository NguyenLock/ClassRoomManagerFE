import apiInstance from "./api";
import { GetMyLessonsResponse, MarkDoneLessonResponse } from "../types";

const lessonService = {
  getMyLessons: async (phoneNumber: string): Promise<GetMyLessonsResponse> => {
    try {
      const response = await apiInstance.get(
        `${import.meta.env.VITE_GET_LESSON_BY_PHONE}?phoneNumber=${phoneNumber}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markDoneLesson: async (lessonId: string): Promise<MarkDoneLessonResponse> => {
    try {
      const response = await apiInstance.post(
        import.meta.env.VITE_MARK_DONE_LESSON,
        { lessonId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default lessonService; 