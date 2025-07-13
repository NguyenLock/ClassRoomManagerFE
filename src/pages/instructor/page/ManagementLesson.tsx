import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Tag, Button, message, Form, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserPlus } from "lucide-react";
import { Lesson, Student } from "../../../types";
import { AxiosError } from "axios";
import ReusableModal from "../../../components/UI/modal";
import lessonManagementService from "../../../services/lessonManagement.service";
import studentManagementService from "../../../services/studentManagement.service";
import ReusableTable from "../../../components/UI/table";

const ManagementLesson = () => {
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  const fetchStudents = async () => {
    try {
      const response = await studentManagementService.getAllStudents();
      if (response.success) {
        setStudents(response.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await lessonManagementService.getAllLessons();
      if (response.success) {
        setLessons(response.lessons);
      } else {
        message.error("Failed to fetch lessons");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        message.error(axiosError.response.data.message);
      } else {
        message.error("Failed to fetch lessons");
      }
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const columns: ColumnsType<Lesson> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "30%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag
          color={status === "active" ? "success" : "warning"}
          className="rounded-full capitalize"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Students Progress",
      key: "studentStats",
      width: "20%",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Total:</span>
            <span className="font-medium">{record.studentStats.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Completed:</span>
            <Tag color="success" className="m-0">
              {record.studentStats.completed}
            </Tag>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">In Progress:</span>
            <Tag color="processing" className="m-0">
              {record.studentStats.inProgress}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Button
            type="text"
            icon={<UserPlus size={16} className="text-green-600" />}
            onClick={() => handleAssign(record)}
            className="flex items-center hover:text-green-700"
          />
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    console.log("Searching for:", value);
  };

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleAddSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await lessonManagementService.createLesson(values);
      if (response.success) {
        message.success("Lesson added successfully");
        setIsAddModalVisible(false);
        form.resetFields();
        await fetchLessons();
      } else {
        message.error("Failed to add lesson");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        message.error(axiosError.response.data.message);
      } else {
        message.error("Failed to add lesson");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    console.log("Editing lesson:", lesson);
  };

  const handleDelete = (lesson: Lesson) => {
    console.log("Deleting lesson:", lesson);
  };

  const handleFilter = () => {
    console.log("Opening filter");
  };

  const handleAssign = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsAssignModalVisible(true);
  };

  const handleAssignSubmit = async () => {
    try {
      if (!selectedLesson) return;

      const values = await assignForm.validateFields();
      setLoading(true);

      const response = await lessonManagementService.assignLesson({
        lessonId: selectedLesson.id,
        studentPhone: values.studentPhones,
      });

      if (response.success) {
        message.success("Lesson assigned successfully");
        setIsAssignModalVisible(false);
        assignForm.resetFields();
        await fetchLessons();
      } else {
        message.error("Failed to assign lesson");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        message.error(axiosError.response.data.message);
      } else {
        message.error("Failed to assign lesson");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <ReusableTable<Lesson>
        title="Lesson Management"
        data={lessons}
        columns={columns}
        loading={loading}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onFilter={handleFilter}
        addButtonText="Add Lesson"
        searchPlaceholder="Search lessons..."
      />

      <ReusableModal
        title="Add New Lesson"
        isVisible={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        loading={loading}
        form={form}
      >
        <Form.Item
          name="title"
          label="Lesson Title"
          rules={[{ required: true, message: "Please input lesson title!" }]}
        >
          <Input placeholder="Enter lesson title" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please input lesson description!" },
          ]}
        >
          <Input.TextArea placeholder="Enter lesson description" rows={4} />
        </Form.Item>
      </ReusableModal>

      <ReusableModal
        title="Assign Lesson to Students"
        isVisible={isAssignModalVisible}
        onOk={handleAssignSubmit}
        onCancel={() => {
          setIsAssignModalVisible(false);
          assignForm.resetFields();
        }}
        loading={loading}
        form={assignForm}
      >
        <Form.Item
          name="studentPhones"
          label="Select Students"
          rules={[
            { required: true, message: "Please select at least one student!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select students to assign"
            style={{ width: "100%" }}
            optionFilterProp="children"
            options={students.map((student) => ({
              value: student.phoneNumber || "",
              label: `${student.name || "Unnamed"} (${
                student.phoneNumber || "No phone"
              })`,
              disabled: !student.phoneNumber,
            }))}
          />
        </Form.Item>
      </ReusableModal>
    </div>
  );
};

export default ManagementLesson;
