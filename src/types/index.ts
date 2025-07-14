import { FormInstance } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReactNode } from "react";

export interface EditProfileRequest {
  name: string;
  email: string;
}

export interface AuthMeResponse {
  phoneNumber: string;
  name: string;
  email: string;
  userType: string;
  createdAt: string;
  updatedAt: string;
}
export interface SetupAccountRequest {
  name: string;
  phoneNumber: string;
  password: string;
}

export interface CreateAccessCode {
  phoneNumber: string;
}
export interface CreateAccessCodeResponse {
  accessCode?: string;
  message?: string;
  error?: string;
}
export interface VerifyAccessCodeRequest {
  phoneNumber: string;
  accessCode: string;
}

export interface VerifyAccessCodeResponse {
  success: boolean;
  userType: string;
  accessToken: string;
}

export interface StudentLoginRequest {
  email: string;
  password: string;
}

export interface AccessCodeValidationRequest {
  email: string;
  accessCode: string;
}

export interface StudentAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      email: string;
      name: string;
      phoneNumber: string;
      userType: string;
    };
  };
}
export interface ReusableTableProps<T = any> {
  title?: string;
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  onAdd?: () => void;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  addButtonText?: string;
  searchPlaceholder?: string;
  showActions?: boolean;
  hideAddButton?: boolean;
}
export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  children?: MenuItem[];
}
export interface SidebarProps {
  collapsed?: boolean;
  onMenuClick?: (key: string) => void;
  userType: "instructor" | "student";
  title?: string;
  logo?: React.ReactNode;
}
export interface HeaderAvatarProps {
  onToggleSidebar?: () => void;
  userAvatar?: string;
  pageTitle?: string;
  onLogout?: () => void;
  onProfileClick?: () => void;
  showMenuButton?: boolean;
  className?: string;
}
export interface Student {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isOnline?: boolean;
}
export interface GetAllStudentsResponse {
  success: boolean;
  students: Student[];
  message?: string;
}
export interface AddStudentRequest {
  email: string;
}
export interface UpdateStudentData {
  email?: string;
  name?: string;
  phoneNumber?: string;
}
export interface StudentDetail {
  email: string;
  name: string | null;
  phoneNumber: string | null;
  lessons: string[];
  accountSetup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetStudentDetailResponse {
  success: boolean;
  student: StudentDetail;
}
export interface Lesson {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: string;
  studentStats: {
    total: number;
    completed: number;
    inProgress: number;
  };
}
export interface GetAllLessonsResponse {
  success: boolean;
  total: number;
  lessons: Lesson[];
}
export interface CreateLessonPayload {
  title: string;
  description: string;
}
export interface ReusableModalProps {
  title: string;
  isVisible: boolean;
  onOk: () => void;
  onCancel: () => void;
  loading?: boolean;
  form: FormInstance;
  children: ReactNode;
}

export interface ServerMessage {
  message: string;
  studentEmail: string;
  instructorPhone?: string;
  fromName?: string;
  senderType: 'student' | 'instructor';
  timestamp: string | Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text';
  isOwn: boolean;
}

export interface SocketMessage {
  content: string;
  recipientEmail: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  role: "student" | "instructor";
}
export interface Stat {
  number: string;
  label: string;
}

export interface AssignLessonPayload {
  studentPhone: string[];
  lessonId: string;
}

export interface AssignLessonResponse {
  success: boolean;
  message: string;
}

export interface ChatMessage {
  id: string;
  studentEmail: string;
  message: string;
  timestamp: string;
  senderType: 'student' | 'instructor';
  fromName?: string;
  instructorPhone?: string;
}

export interface ChatHistoryResponse {
  success: boolean;
  data: ChatMessage[];
}
export interface LessonStudent {
  lessonId: string;
  title: string;
  description: string;
  assignedAt: string;
  status: string;
  completedAt?: string;
}

export interface GetMyLessonsResponse {
  success: boolean;
  data: {
    lessons: LessonStudent[];
  };
}

export interface MarkDoneLessonResponse {
  success: boolean;
  message: string;
  data: {
    lessons: LessonStudent[];
  };
}

export interface Instructor {
  phoneNumber: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllInstructorsResponse {
  success: boolean;
  total: number;
  data: Instructor[];
}

