import {
  GetMyAssignmentsResponse,
  SubmitAssignmentRequest,
  GetMySubmissionsResponse,
  StudentAssignment
} from "../types";
import apiInstance from "./api";

const assignmentService = {
  // Submit assignment
  submitAssignment: async (assignmentId: string, payload: SubmitAssignmentRequest) => {
    try {
      const response = await apiInstance.post(
        import.meta.env.VITE_SUBMIT_ASSIGNMENT,
        {
          assignmentId,
          ...payload
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in submitAssignment:", error);
      throw error;
    }
  },

  // Get student's submission for specific assignment
  getStudentSubmission: async (assignmentId: string) => {
    try {
      const response = await apiInstance.get(
        import.meta.env.VITE_GET_STUDENT_SUBMISSION.replace(':assignmentId', assignmentId)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete submission
  deleteSubmission: async (submissionId: string) => {
    try {
      const response = await apiInstance.delete(
        import.meta.env.VITE_DELETE_SUBMISSION.replace(':submissionId', submissionId)
      );
      return response.data;
    } catch (error) {
      console.error("Error in deleteSubmission:", error);
      throw error;
    }
  }
};

export default assignmentService;