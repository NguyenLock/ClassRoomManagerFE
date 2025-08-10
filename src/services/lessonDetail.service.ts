import apiInstance from "./api";

const lessonDetailService = {
  // Get lesson details with assignments and submissions (for instructor)
  getLessonById: async (lessonId: string, includeAssignments = true, includeSubmissions = false) => {
    try {
      const params = new URLSearchParams();
      if (includeAssignments) params.append('includeAssignments', 'true');
      if (includeSubmissions) params.append('includeSubmissions', 'true');
      
      const response = await apiInstance.get(
        `/instructor/lesson/${lessonId}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentLessonDetail: async (lessonId: string) => {
    try {
      const endpoint = import.meta.env.VITE_GET_STUDENT_LESSON_DETAIL?.replace(':lessonId', lessonId);
      const response = await apiInstance.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default lessonDetailService;