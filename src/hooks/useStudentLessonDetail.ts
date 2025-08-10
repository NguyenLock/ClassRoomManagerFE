import { useState, useEffect, useCallback } from 'react';
import lessonDetailService from '../services/lessonDetail.service';
import { showToast } from '../components/UI/modal/Toast';

interface StudentLessonDetail {
  lessonId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  assignedAt?: string;
  completedAt?: string;
  assignments?: any[];
}

export const useStudentLessonDetail = (lessonId: string) => {
  const [lesson, setLesson] = useState<StudentLessonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson details for student
  const fetchStudentLessonDetail = useCallback(async () => {
    if (!lessonId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await lessonDetailService.getStudentLessonDetail(lessonId);
      console.log('API Response:', response); // Debug log
      
      // Handle different response structures
      if (response.success && response.data) {
        setLesson(response.data);
      } else if (response.success && response.lesson) {
        setLesson(response.lesson);
      } else if (response && !response.success) {
        // API returned error but with 200 status
        setError(response.message || 'Failed to fetch lesson details');
        showToast.error(response.message || 'Failed to fetch lesson details');
      } else if (response) {
        // Direct data without success wrapper
        setLesson(response);
      } else {
        setError('No data received');
        showToast.error('No data received');
      }
    } catch (err) {
      console.error('Error fetching lesson:', err);
      const errorMessage = 'Failed to fetch lesson details';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchStudentLessonDetail();
  }, [fetchStudentLessonDetail]);

  return {
    lesson,
    loading,
    error,
    fetchStudentLessonDetail
  };
};