import { useState } from "react";
import { Tabs, Button, Tag, Modal, Form, Input, DatePicker, InputNumber, Card, Descriptions } from "antd";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Assignment, CreateAssignmentRequest, UpdateAssignmentRequest } from "../../../types";
import { useLessonDetail } from "../../../hooks/useLessonDetail";
import { showToast, ToastComponent } from "../../../components/UI/modal/Toast";
import ReusableTable from "../../../components/UI/table";
import ReusableModal from "../../../components/UI/modal";

const { TabPane } = Tabs;
const { TextArea } = Input;

interface LessonDetailProps {
  lessonId: string;
  onBack: () => void;
}

export const LessonDetail = ({ lessonId, onBack }: LessonDetailProps) => {
  const {
    lesson,
    assignments,
    loading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentSubmissions
  } = useLessonDetail(lessonId);

  const [activeTab, setActiveTab] = useState("info");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleAddAssignment = () => {
    setIsAddModalVisible(true);
    form.resetFields();
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      ...assignment,
      deadline: dayjs(assignment.deadline)
    });
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    console.log("🔥 DELETE CLICKED - Assignment ID:", assignmentId);
    setDeleteAssignmentId(assignmentId);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteAssignmentId) return;
    
    console.log("🔥 DELETE CONFIRMED - Assignment ID:", deleteAssignmentId);
    try {
      await deleteAssignment(deleteAssignmentId);
      setIsDeleteModalVisible(false);
      setDeleteAssignmentId(null);
    } catch (error) {
      console.error("🔥 DELETE ERROR:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteAssignmentId(null);
  };

  const handleViewSubmissions = async (assignment: Assignment) => {
    try {
      const submissions = await getAssignmentSubmissions(assignment.id);
      // TODO: Open submissions modal or navigate to submissions page
      console.log('Submissions:', submissions);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleAddSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: Omit<CreateAssignmentRequest, 'lessonId'> = {
        ...values,
        deadline: values.deadline.toISOString(),
      };
      await createAssignment(payload);
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Error handled in hook or validation
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedAssignment) return;
    
    try {
      const values = await editForm.validateFields();
      const payload: UpdateAssignmentRequest = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
      };
      await updateAssignment(selectedAssignment.id, payload);
      setIsEditModalVisible(false);
      setSelectedAssignment(null);
      editForm.resetFields();
    } catch (error) {
      // Error handled in hook or validation
    }
  };

  const assignmentColumns: ColumnsType<Assignment> = [
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
      render: (text) => (
        <div className="max-w-xs truncate" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date) => {
        const deadline = dayjs(date);
        const isOverdue = deadline.isBefore(dayjs());
        return (
          <Tag color={isOverdue ? "red" : "blue"}>
            {deadline.format("MMM DD, YYYY HH:mm")}
          </Tag>
        );
      },
    },
    {
      title: "Max Score",
      dataIndex: "maxScore",
      key: "maxScore",
      render: (score) => <span className="font-medium">{score} pts</span>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewSubmissions(record)}
            className="text-blue-600"
            title="View Submissions"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditAssignment(record)}
            className="text-green-600"
            title="Edit Assignment"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteAssignment(record.id)}
            className="text-red-600"
            title="Delete Assignment"
          />
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchText.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchText.toLowerCase())
  );

  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <ToastComponent />
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="mr-4"
        >
          Back to Lessons
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          <p className="text-gray-600">Lesson Details</p>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Lesson Info Tab */}
        <TabPane tab="Lesson Information" key="info">
          <Card>
            <Descriptions title="Lesson Details" bordered>
              <Descriptions.Item label="Title" span={3}>
                {lesson.title}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={3}>
                {lesson.description}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={lesson.status === 'active' ? 'green' : 'default'}>
                  {lesson.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {dayjs(lesson.createdAt).format("MMMM DD, YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {dayjs(lesson.updatedAt).format("MMMM DD, YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        {/* Assignments Tab */}
        <TabPane tab={`Assignments (${assignments.length})`} key="assignments">
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <div className="text-2xl font-bold text-blue-600">{assignments.length}</div>
                <div className="text-gray-600">Total Assignments</div>
              </Card>
              
              <Card className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {assignments.filter(a => dayjs(a.deadline).isAfter(dayjs())).length}
                </div>
                <div className="text-gray-600">Active Assignments</div>
              </Card>
              
              <Card className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {assignments.filter(a => dayjs(a.deadline).isBefore(dayjs())).length}
                </div>
                <div className="text-gray-600">Overdue Assignments</div>
              </Card>
            </div>
          </div>

          <ReusableTable<Assignment>
            title="Lesson Assignments"
            data={filteredAssignments}
            columns={assignmentColumns}
            loading={loading}
            onAdd={handleAddAssignment}
            onSearch={handleSearch}
            addButtonText="Add Assignment"
            searchPlaceholder="Search assignments..."
            showActions={true}
          />
        </TabPane>
      </Tabs>

      {/* Add Assignment Modal */}
      <ReusableModal
        title="Add New Assignment"
        isVisible={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        loading={loading}
        form={form}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Assignment Title"
            rules={[{ required: true, message: "Please enter assignment title" }]}
          >
            <Input placeholder="Enter assignment title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter assignment description" />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: "Please select deadline" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="Select deadline"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="maxScore"
            label="Maximum Score"
            rules={[{ required: true, message: "Please enter maximum score" }]}
          >
            <InputNumber
              min={1}
              max={1000}
              placeholder="Enter maximum score"
              className="w-full"
            />
          </Form.Item>
        </Form>
      </ReusableModal>

      {/* Edit Assignment Modal */}
      <ReusableModal
        title="Edit Assignment"
        isVisible={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedAssignment(null);
          editForm.resetFields();
        }}
        loading={loading}
        form={editForm}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="title"
            label="Assignment Title"
            rules={[{ required: true, message: "Please enter assignment title" }]}
          >
            <Input placeholder="Enter assignment title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter assignment description" />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Deadline"
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="Select deadline"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="maxScore"
            label="Maximum Score"
          >
            <InputNumber
              min={1}
              max={1000}
              placeholder="Enter maximum score"
              className="w-full"
            />
          </Form.Item>
        </Form>
      </ReusableModal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Assignment"
        open={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Yes, Delete"
        cancelText="Cancel"
        okType="danger"
        confirmLoading={loading}
      >
        <p>Are you sure you want to delete this assignment?</p>
        <p className="text-red-600 font-medium">This action cannot be undone and will also delete all submissions.</p>
      </Modal>
    </div>
  );
};