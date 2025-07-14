import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/auth';
import HeaderAvatar from '../../components/UI/HeaderAvatar';
import Sidebar from '../../components/UI/SideBar';
import ChatInterface from '../../components/UI/Chat';
import { LessonManagementStudent } from './page/LessonManagementStudent';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>("lessons");

  const handleLogout = () => {
    auth.removeToken();
    localStorage.removeItem('userType');
    navigate('/');
  };

  const handleMenuClick = (key: string) => {
    setCurrentPage(key);
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const renderContent = () => {
    switch (currentPage) {
      case "chat":
        return (
          <div className="h-[calc(100vh-7rem)]">
            <ChatInterface />
          </div>
        );
      case "lessons":
      default:
        return <LessonManagementStudent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        userType="student"
        collapsed={collapsed}
        onMenuClick={handleMenuClick}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderAvatar
          pageTitle={
            currentPage === "chat"
              ? "Chat"
              : "My Lessons"
          }
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          showMenuButton={true}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}; 