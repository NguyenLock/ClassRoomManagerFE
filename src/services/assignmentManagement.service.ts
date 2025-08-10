import {
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  GetAssignmentsByLessonResponse,
  GetSubmissionsResponse,
  GradeSubmissionRequest,
} from "../types";
import apiInstance from "./api";

const assignmentManagementService = {
  getAssignmentsByLesson: async (lessonId: string, page = 1, pageSize = 10): Promise<GetAssignmentsByLessonResponse> => {
    try {
      const response = await apiInstance.get<GetAssignmentsByLessonResponse>(
        `/assignments/lesson/${lessonId}?page=${page}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAssignment: async (payload: CreateAssignmentRequest) => {
    try {
      const response = await apiInstance.post(
        import.meta.env.VITE_CREATE_ASSIGNMENT,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in createAssignment:", error);
      throw error;
    }
  },

  updateAssignment: async (assignmentId: string, payload: UpdateAssignmentRequest) => {
    try {
      const response = await apiInstance.put(
        import.meta.env.VITE_UPDATE_ASSIGNMENT.replace(':assignmentId', assignmentId),
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in updateAssignment:", error);
      throw error;
    }
  },

  deleteAssignment: async (assignmentId: string) => {
    try {
      const response = await apiInstance.delete(
        import.meta.env.VITE_DELETE_ASSIGNMENT.replace(':assignmentId', assignmentId)
      );
      return response.data;
    } catch (error) {
      console.error("Error in deleteAssignment:", error);
      throw error;
    }
  },

  getSubmissions: async (assignmentId: string): Promise<GetSubmissionsResponse> => {
    try {
      const response = await apiInstance.get<GetSubmissionsResponse>(
        import.meta.env.VITE_GET_ASSIGNMENT_SUBMISSIONS.replace(':assignmentId', assignmentId)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  gradeSubmission: async (submissionId: string, payload: GradeSubmissionRequest) => {
    try {
      const response = await apiInstance.put(
        import.meta.env.VITE_GRADE_SUBMISSION.replace(':submissionId', submissionId),
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in gradeSubmission:", error);
      throw error;
    }
  },

  // Get assignment details
  // getAssignmentDetails: async (assignmentId: string): Promise<Assignment> => {
  //   try {
  //     const response = await apiInstance.get<{ success: boolean; assignment: Assignment }>(
  //       `/assignments/${assignmentId}`
  //     );
  //     return response.data.assignment;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
};

export default assignmentManagementService;