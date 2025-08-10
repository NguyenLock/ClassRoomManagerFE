import React, { useState, useEffect } from "react";
import { Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { LessonStudent } from "../../../types";
import { auth } from "../../../utils/auth";
import { showToast, ToastComponent } from "../../../components/UI/modal/Toast";
import ReusableTable from "../../../components/UI/table";
import lessonService from "../../../services/lessonService";
import lessonDetailService from "../../../services/lessonDetail.service";
import { LessonStudentDetail } from "./LessonStudentDetail";

export const LessonManagementStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<LessonStudent[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const token = auth.getToken();
      if (!token) {
        navigate("/");
        return;
      }

      const decoded: any = jwtDecode(token);
      const phoneNumber = decoded.phoneNumber;

      if (!phoneNumber) {
        showToast.error("Phone number not found in token");
        return;
      }

      const response = await lessonService.getMyLessons(phoneNumber);
      if (response.success) {
        setLessons(response.data.lessons);
      }
    } catch (error) {
      showToast.error("Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [navigate]);

  const handleMarkDone = async (lessonId: string) => {
    try {
      setLoading(true);
      
      // First validate lesson content before allowing completion
      try {
        const lessonDetail = await lessonDetailService.getStudentLessonDetail(lessonId);
        
        // Check if lesson has meaningful content
        let hasContent = false;
        
        if (lessonDetail.success && lessonDetail.data) {
          const lesson = lessonDetail.data;
          hasContent = (lesson.description && lesson.description.trim() !== "") || 
                      (lesson.assignments && lesson.assignments.length > 0);
        } else if (lessonDetail && !lessonDetail.success) {
          // Handle direct response
          hasContent = (lessonDetail.description && lessonDetail.description.trim() !== "") || 
                      (lessonDetail.assignments && lessonDetail.assignments.length > 0);
        }
        
        if (!hasContent) {
          showToast.warning("Cannot complete lesson: This lesson appears to be empty or has no assignments. Please contact your instructor.");
          return;
        }
      } catch (detailError) {
        console.error("Error checking lesson content:", detailError);
        showToast.warning("Unable to verify lesson content. Please try again or contact your instructor.");
        return;
      }

      // If validation passes, proceed with marking as done
      const response = await lessonService.markDoneLesson(lessonId);
      if (response.success) {
        showToast.success(response.message);
        setLessons(response.data.lessons);
      }
    } catch (error) {
      showToast.error("Failed to mark lesson as done");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedLessonId(null);
  };

  const columns: ColumnsType<LessonStudent> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedAt",
      key: "assignedAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "processing";
        let displayStatus = status;
        
        switch (status.toLowerCase()) {
          case "completed":
            color = "success";
            break;
          case "waiting":
            color = "warning";
            displayStatus = "Waiting for Content";
            break;
          case "pending":
          case "assigned":
            color = "processing";
            break;
          default:
            color = "default";
        }
        
        return (
          <Tag color={color}>
            {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.lessonId)}
            size="small"
          >
            View Detail
          </Button>
          {record.status !== "completed" && record.status.toLowerCase() !== "waiting" && (
            <Button
              type="primary"
              onClick={() => handleMarkDone(record.lessonId)}
              className="bg-blue-600"
              size="small"
            >
              Mark as Done
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchText.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // Show lesson detail if selected
  if (showDetail && selectedLessonId) {
    return (
      <LessonStudentDetail
        lessonId={selectedLessonId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <ToastComponent />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Total Lessons
          </h3>
          <p className="text-3xl font-bold text-blue-600">{lessons.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Completed Lessons
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {lessons.filter((lesson) => lesson.status === "completed").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Lessons
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {lessons.filter((lesson) => lesson.status !== "completed" && lesson.status.toLowerCase() !== "waiting").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Waiting for Content
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {lessons.filter((lesson) => lesson.status.toLowerCase() === "waiting").length}
          </p>
        </div>
      </div>

      <ReusableTable<LessonStudent>
        title="My Assigned Lessons"
        data={filteredLessons}
        columns={columns}
        loading={loading}
        onSearch={handleSearch}
        showActions={true}
        searchPlaceholder="Search lessons..."
        hideAddButton={true}
      />
    </div>
  );
};
