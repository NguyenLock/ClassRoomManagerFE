import { useState, useEffect } from 'react';
import ReusableTable from '../../../components/UI/table';
import { Tag, Button, Modal, message, Popconfirm, Form, Input, Descriptions, List, Popover } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Student } from '../../../types';
import studentManagementService from '../../../services/studentManagement.service';
import { AxiosError } from 'axios';

const ManagementStudent = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [studentDetail, setStudentDetail] = useState<any>(null);
  const [editForm] = Form.useForm();
  const [form] = Form.useForm();

  const renderStudentDetail = (detail: any) => (
    <div className="w-[400px]">
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="Name" className="font-medium">
          {detail.name || 'Not set up'}
        </Descriptions.Item>
        <Descriptions.Item label="Email" className="font-medium">
          {detail.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number" className="font-medium">
          {detail.phoneNumber || 'Not set up'}
        </Descriptions.Item>
        <Descriptions.Item label="Account Status" className="font-medium">
          {detail.accountSetup ? (
            <Tag color="success">Active</Tag>
          ) : (
            <Tag color="warning">Pending Setup</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Lessons</h3>
        {detail.lessons.length > 0 ? (
          <List
            size="small"
            bordered
            dataSource={detail.lessons}
            renderItem={(lesson: string) => (
              <List.Item className="py-1 px-2">{lesson}</List.Item>
            )}
          />
        ) : (
          <p className="text-gray-500 text-sm">No lessons assigned yet</p>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>Created: {dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm')}</p>
        <p>Updated: {dayjs(detail.updatedAt).format('DD/MM/YYYY HH:mm')}</p>
      </div>
    </div>
  );

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentManagementService.getAllStudents();
      if (response.success) {
        setStudents(response.students);
      } else {
        message.error('Failed to fetch students');
      }
    } catch (error) {
      message.error('Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetail = async (email: string) => {
    try {
      setLoading(true);
      const response = await studentManagementService.getStudentDetail(email);
      if (response.success) {
        setStudentDetail(response.student);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        message.error(axiosError.response.data.message);
      } else {
        message.error('Failed to fetch student details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    editForm.setFieldsValue({
      name: student.name || '',
      email: student.email,
      phoneNumber: student.phoneNumber || ''
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = async (student: Student) => {
    try {
      setLoading(true);
      await studentManagementService.deleteStudent(student.email);
      message.success('Student deleted successfully');
      await fetchStudents();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        message.error(axiosError.response.data.message);
      } else {
        message.error('Failed to delete student');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!selectedStudent) return;
      
      const values = await editForm.validateFields();
      setLoading(true);
      
      await studentManagementService.editStudent(selectedStudent.email, {
        name: values.name,
        phoneNumber: values.phoneNumber
      });

      message.success('Student updated successfully');
      setIsEditModalVisible(false);
      await fetchStudents();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        message.error(axiosError.response.data.message);
      } else {
        message.error('Failed to update student');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleAddSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      await studentManagementService.addStudent(values.email);
      message.success('Student added successfully');
      setIsAddModalVisible(false);
      form.resetFields();
      await fetchStudents();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        message.error(axiosError.response.data.message);
      } else {
        message.error('Failed to add student');
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Student> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string | null) => name || 'Not set up',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone: string | null) => phone || 'Not set up',
    },
    {
      title: 'Account Status',
      dataIndex: 'accountSetup',
      key: 'accountSetup',
      render: (setup: boolean) => (
        setup ? (
          <Tag color="success" className="rounded-full">Active</Tag>
        ) : (
          <Tag color="warning" className="rounded-full">Pending Setup</Tag>
        )
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Popover
            content={studentDetail && renderStudentDetail(studentDetail)}
            title={<div className="font-medium">Student Details</div>}
            trigger="click"
            placement="left"
            onOpenChange={(visible) => {
              if (visible) {
                fetchStudentDetail(record.email);
              } else {
                setStudentDetail(null);
              }
            }}
          >
            <Button
              type="text"
              icon={<Eye size={16} className="text-green-600" />}
              className="flex items-center hover:text-green-700"
              loading={loading && studentDetail?.email === record.email}
            />
          </Popover>
          <Button
            type="text"
            icon={<Edit2 size={16} className="text-blue-600" />}
            onClick={() => handleEdit(record)}
            className="flex items-center hover:text-blue-700"
          />
          <Popconfirm
            title="Delete Student"
            description="Are you sure you want to delete this student?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<Trash2 size={16} className="text-red-600" />}
              className="flex items-center hover:text-red-700"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    console.log('Searching for:', value);
  };

  const handleFilter = () => {
    console.log('Opening filter');
  };

  return (
    <div className="p-6">
      <ReusableTable<Student>
        title="Student Management"
        data={students}
        columns={columns}
        loading={loading}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onFilter={handleFilter}
        addButtonText="Add Student"
        searchPlaceholder="Search students..."
      />

      <Modal
        title="Edit Student"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={loading}
      >
        <Form
          form={editForm}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input student name!' }]}
          >
            <Input placeholder="Enter student name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
          >
            <Input disabled className="bg-gray-50" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add New Student"
        open={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="email"
            label="Student Email"
            rules={[
              { required: true, message: 'Please input student email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="Enter student email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagementStudent;
