import React from "react";
import { Menu } from "antd";
import {
  BookOpen,
  Users,
  MessageCircle,
  Home,
  BookOpenCheck,
  Calendar,
  Settings,
} from "lucide-react";
import { MenuItem, SidebarProps } from "../../types";

const instructorMenuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: <Home size={20} />,
    label: "Dashboard",
  },
  {
    key: "lessons",
    icon: <BookOpen size={20} />,
    label: "Manage Lessons",
  },
  {
    key: "students",
    icon: <Users size={20} />,
    label: "Manage Students",
  },
  {
    key: "chat",
    icon: <MessageCircle size={20} />,
    label: "Chat",
  },
];

const studentMenuItems: MenuItem[] = [
  {
    key: "lessons",
    icon: <BookOpenCheck size={20} />,
    label: "My Lessons",
  },
  {
    key: "chat",
    icon: <MessageCircle size={20} />,
    label: "Chat",
  }
];

const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onMenuClick,
  userType,
  title = "ClassManagerApp",
  logo = <BookOpen className="text-white" size={20} />,
}) => {
  const menuItems =
    userType === "instructor" ? instructorMenuItems : studentMenuItems;

  return (
    <div
      className={`h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-gray-200 font-sans">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 ${
              userType === "instructor" ? "bg-blue-600" : "bg-green-600"
            } rounded-lg flex items-center justify-center`}
          >
            {logo}
          </div>
          {!collapsed && (
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Menu
          mode="inline"
          defaultSelectedKeys={["lessons"]}
          items={menuItems}
          onClick={({ key }) => onMenuClick?.(key)}
          className="border-none"
          style={{
            backgroundColor: "transparent",
            fontSize: "14px",
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
