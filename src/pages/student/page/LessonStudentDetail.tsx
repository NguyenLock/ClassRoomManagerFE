import { Card, Spin, Button, Tag, Descriptions } from "antd";
import { ArrowLeftOutlined, BookOutlined, CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useStudentLessonDetail } from "../../../hooks/useStudentLessonDetail";
import { ToastComponent } from "../../../components/UI/modal/Toast";

interface LessonStudentDetailProps {
  lessonId: string;
  onBack: () => void;
}

export const LessonStudentDetail = ({ lessonId, onBack }: LessonStudentDetailProps) => {
  const { lesson, loading, error } = useStudentLessonDetail(lessonId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto px-6 py-8">
        <ToastComponent />
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Lesson not found"}</p>
          <Button onClick={onBack} icon={<ArrowLeftOutlined />}>
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'waiting':
        return 'warning';
      case 'pending':
      case 'assigned':
      case 'in_progress':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'waiting':
        return 'Waiting for Content';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <ToastComponent />
      
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={onBack} 
          icon={<ArrowLeftOutlined />}
          className="mb-4"
        >
          Back to My Lessons
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {lesson.title}
            </h1>
            <div className="flex items-center gap-4">
              <Tag 
                color={getStatusColor(lesson.status)} 
                icon={lesson.status === 'completed' ? <CheckCircleOutlined /> : <BookOutlined />}
                className="text-sm"
              >
                {getStatusDisplay(lesson.status)}
              </Tag>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card title="Lesson Description" className="mb-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {lesson.description}
              </p>
            </div>
          </Card>

          {/* Assignments Section */}
          <Card title="Assignments" className="mb-6">
            {lesson.assignments && lesson.assignments.length > 0 ? (
              <div className="space-y-4">
                {lesson.assignments.map((assignment: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold text-lg mb-2">{assignment.title}</h4>
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {assignment.deadline && (
                        <span className="flex items-center gap-1">
                          <CalendarOutlined />
                          Deadline: {formatDate(assignment.deadline)}
                        </span>
                      )}
                      {assignment.maxScore && (
                        <span>Max Score: {assignment.maxScore}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOutlined className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No assignments yet</p>
                <p className="text-gray-400 text-sm">
                  {lesson.status.toLowerCase() === 'waiting' 
                    ? "Your instructor is still preparing this lesson. Please check back later."
                    : "No assignments have been added to this lesson yet."
                  }
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card title="Lesson Information">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(lesson.status)}>
                  {getStatusDisplay(lesson.status)}
                </Tag>
              </Descriptions.Item>
              
              {lesson.assignedAt && (
                <Descriptions.Item label="Assigned Date">
                  {formatDate(lesson.assignedAt)}
                </Descriptions.Item>
              )}
              
              {lesson.completedAt && (
                <Descriptions.Item label="Completed Date">
                  {formatDate(lesson.completedAt)}
                </Descriptions.Item>
              )}
              
              <Descriptions.Item label="Created Date">
                {formatDate(lesson.createdAt)}
              </Descriptions.Item>
              
              <Descriptions.Item label="Last Updated">
                {formatDate(lesson.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Progress Card */}
          <Card title="Progress" className="mt-6">
            <div className="text-center">
              {lesson.status.toLowerCase() === 'completed' ? (
                <div className="text-green-600">
                  <CheckCircleOutlined className="text-4xl mb-2" />
                  <p className="font-semibold">Completed!</p>
                  <p className="text-sm text-gray-500">
                    Great job finishing this lesson
                  </p>
                </div>
              ) : lesson.status.toLowerCase() === 'waiting' ? (
                <div className="text-orange-600">
                  <BookOutlined className="text-4xl mb-2" />
                  <p className="font-semibold">Waiting for Content</p>
                  <p className="text-sm text-gray-500">
                    Your instructor is preparing this lesson
                  </p>
                </div>
              ) : (
                <div className="text-blue-600">
                  <BookOutlined className="text-4xl mb-2" />
                  <p className="font-semibold">In Progress</p>
                  <p className="text-sm text-gray-500">
                    Keep working on this lesson
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};