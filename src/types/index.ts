import { ColumnsType } from "antd/es/table";

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
    }
  }
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
  userName: string;
  userAvatar?: string;
  userRole?: string;
  pageTitle?: string;
  onLogout?: () => void;
  onProfileClick?: () => void;
  showMenuButton?: boolean;
  className?: string;
}
export interface Student {
  name: string | null;
  phoneNumber: string | null;
  email: string;
  accountSetup: boolean;
  createdAt: string;
}
export interface GetAllStudentsResponse {
  success: boolean;
  students: Student[];
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
export interface Stat {
  number: string;
  label: string;
}
