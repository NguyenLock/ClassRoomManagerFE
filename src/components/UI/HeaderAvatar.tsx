import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, Button, Spin, Form, Input, message } from "antd";
import { User, LogOut, Menu as MenuIcon } from "lucide-react";
import type { MenuProps } from "antd";
import { HeaderAvatarProps } from "../../types";
import authService from "../../services/auth.service";
import { instructorAuthService } from "../../services/instructorAuth.service";
import ReusableModal from "./modal";

const HeaderAvatar: React.FC<HeaderAvatarProps> = ({
  onToggleSidebar,
  userAvatar,
  pageTitle = "Dashboard",
  onLogout,
  onProfileClick,
  showMenuButton = true,
  className = "",
}) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    userType: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await authService.getMe();
        if (data) {
          setUserInfo({
            name: data.name,
            userType: data.userType,
            email: data.email,
          });
          form.setFieldsValue({
            name: data.name,
            email: data.email,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setUserInfo({
          name: "User",
          userType: "user",
          email: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [form]);

  const handleEditProfile = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      await instructorAuthService.editProfile(values);
      
      setUserInfo(prev => ({
        ...prev,
        name: values.name,
        email: values.email,
      }));

      message.success("Profile updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="flex items-center space-x-2 py-1">
          <User size={16} />
          <span>Profile</span>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div className="flex items-center space-x-2 py-1 text-red-600">
          <LogOut size={16} />
          <span>Logout</span>
        </div>
      ),
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      onLogout?.();
    } else if (key === "profile") {
      setIsModalVisible(true);
    }
  };

  if (loading) {
    return (
      <header
        className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 ${className}`}
      >
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              type="text"
              icon={<MenuIcon size={20} />}
              onClick={onToggleSidebar}
              className="lg:hidden"
            />
          )}
          <h2 className="text-lg font-semibold text-gray-900 font-sans">
            {pageTitle}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <Spin size="small" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 ${className}`}
      >
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              type="text"
              icon={<MenuIcon size={20} />}
              onClick={onToggleSidebar}
              className="lg:hidden"
            />
          )}
          <h2 className="text-lg font-semibold text-gray-900 font-sans">
            {pageTitle}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            arrow
          >
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 font-sans">
                  {userInfo.name}
                </p>
                <p className="text-xs text-gray-500 font-sans capitalize">
                  {userInfo.userType}
                </p>
              </div>
              <Avatar
                size={40}
                src={userAvatar}
                style={{
                  backgroundColor: userAvatar ? undefined : "#1890ff",
                  fontSize: "16px",
                }}
              >
                {!userAvatar && userInfo.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </div>
          </Dropdown>
        </div>
      </header>

      <ReusableModal
        title="Edit Profile"
        isVisible={isModalVisible}
        onOk={handleEditProfile}
        onCancel={() => setIsModalVisible(false)}
        loading={isSubmitting}
        form={form}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" }
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
      </ReusableModal>
    </>
  );
};

export default HeaderAvatar;
