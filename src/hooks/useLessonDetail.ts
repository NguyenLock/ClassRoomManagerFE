import { useState, useEffect, useCallback } from 'react';
import { Assignment, AssignmentSubmission } from '../types';
import lessonDetailService from '../services/lessonDetail.service';
import assignmentManagementService from '../services/assignmentManagement.service';
import { showToast } from '../components/UI/modal/Toast';

interface LessonDetail {
  lessonId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  assignments?: Assignment[];
}

export const useLessonDetail = (lessonId: string) => {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson details with assignments
  const fetchLessonDetail = useCallback(async () => {
    if (!lessonId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get lesson with assignments
      const response = await lessonDetailService.getLessonById(lessonId, true, false);
      if (response.success) {
        setLesson(response.lesson);
        setAssignments(response.lesson.assignments || []);
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch lesson details';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  // Create assignment for this lesson
  const createAssignment = async (assignmentData: {
    title: string;
    description: string;
    deadline: string;
    maxScore: number;
  }) => {
    try {
      setLoading(true);
      const payload = {
        ...assignmentData,
        lessonId
      };
      
      const response = await assignmentManagementService.createAssignment(payload);
      if (response.success) {
        showToast.success('Assignment created successfully');
        await fetchLessonDetail(); // Refresh data
        return response;
      }
    } catch (err) {
      showToast.error('Failed to create assignment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update assignment
  const updateAssignment = async (assignmentId: string, updateData: {
    title?: string;
    description?: string;
    deadline?: string;
    maxScore?: number;
  }) => {
    try {
      setLoading(true);
      const response = await assignmentManagementService.updateAssignment(assignmentId, updateData);
      if (response.success) {
        showToast.success('Assignment updated successfully');
        await fetchLessonDetail(); // Refresh data
        return response;
      }
    } catch (err) {
      showToast.error('Failed to update assignment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete assignment
  const deleteAssignment = async (assignmentId: string) => {
    try {
      setLoading(true);
      const response = await assignmentManagementService.deleteAssignment(assignmentId);
      if (response.success) {
        showToast.success('Assignment deleted successfully');
        await fetchLessonDetail(); // Refresh data
        return response;
      }
    } catch (err) {
      showToast.error('Failed to delete assignment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get submissions for an assignment
  const getAssignmentSubmissions = async (assignmentId: string) => {
    try {
      setLoading(true);
      const response = await assignmentManagementService.getSubmissions(assignmentId);
      return response;
    } catch (err) {
      showToast.error('Failed to fetch submissions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonDetail();
  }, [fetchLessonDetail]);

  return {
    lesson,
    assignments,
    loading,
    error,
    fetchLessonDetail,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentSubmissions
  };
};