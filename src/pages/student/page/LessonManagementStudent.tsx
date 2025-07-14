import React, { useState, useEffect } from "react";
import { Tag, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { LessonStudent } from "../../../types";
import { auth } from "../../../utils/auth";
import ReusableTable from "../../../components/UI/table";
import lessonService from "../../../services/lessonService";

export const LessonManagementStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<LessonStudent[]>([]);
  const [searchText, setSearchText] = useState("");

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
        console.error("Phone number not found in token");
        return;
      }

      const response = await lessonService.getMyLessons(phoneNumber);
      if (response.success) {
        setLessons(response.data.lessons);
      }
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      message.error("Failed to fetch lessons");
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
      const response = await lessonService.markDoneLesson(lessonId);
      if (response.success) {
        message.success(response.message);
        setLessons(response.data.lessons);
      }
    } catch (error) {
      console.error("Failed to mark lesson as done:", error);
      message.error("Failed to mark lesson as done");
    } finally {
      setLoading(false);
    }
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
      render: (status) => (
        <Tag color={status === "completed" ? "success" : "processing"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status !== "completed" && (
          <Button
            type="primary"
            onClick={() => handleMarkDone(record.lessonId)}
            className="bg-blue-600"
          >
            Mark as Done
          </Button>
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

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            {lessons.filter((lesson) => lesson.status !== "completed").length}
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
