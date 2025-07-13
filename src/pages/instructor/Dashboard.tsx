import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/auth";
import Sidebar from "../../components/UI/SideBar";
import HeaderAvatar from "../../components/UI/HeaderAvatar";
import ManagementStudent from "./page/ManagementStudent";

export const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  const handleLogout = () => {
    auth.removeToken();
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleMenuClick = (key: string) => {
    setCurrentPage(key);
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const renderContent = () => {
    switch (currentPage) {
      case "students":
        return <ManagementStudent />;
      case "dashboard":
      default:
        return (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Total Students
                </h3>
                <p className="text-3xl font-bold text-blue-600">150</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Active Lessons
                </h3>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  New Messages
                </h3>
                <p className="text-3xl font-bold text-purple-600">5</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <p className="text-gray-600">
                        New student enrolled in "Advanced Mathematics"
                      </p>
                      <span className="ml-auto text-sm text-gray-400">
                        2h ago
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                      <p className="text-gray-600">
                        Completed lesson "Introduction to Algebra"
                      </p>
                      <span className="ml-auto text-sm text-gray-400">
                        5h ago
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      <p className="text-gray-600">
                        New message from student regarding homework
                      </p>
                      <span className="ml-auto text-sm text-gray-400">
                        1d ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        userType="instructor"
        collapsed={collapsed}
        onMenuClick={handleMenuClick}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderAvatar
          userName="John Smith"
          userRole="Instructor"
          pageTitle={currentPage === "students" ? "Student Management" : "Instructor Dashboard"}
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
