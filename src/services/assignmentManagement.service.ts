import {
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  GetAllAssignmentsResponse,
  GetAssignmentsByLessonResponse,
  GetSubmissionsResponse,
  GradeSubmissionRequest,
  AssignmentSubmission
} from "../types";
import apiInstance from "./api";

const assignmentManagementService = {
  // Get assignments by lesson ID (main API endpoint)
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

  // Create new assignment
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

  // Update assignment
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

  // Delete assignment
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

  // Get submissions for an assignment
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

  // Grade a submission
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