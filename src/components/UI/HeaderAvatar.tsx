import React from 'react';
import { Avatar, Dropdown, Button } from 'antd';
import { User, LogOut, Menu as MenuIcon } from 'lucide-react';
import type { MenuProps } from 'antd';

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

const HeaderAvatar: React.FC<HeaderAvatarProps> = ({ 
  onToggleSidebar, 
  userName,
  userAvatar,
  userRole = "User",
  pageTitle = "Dashboard",
  onLogout,
  onProfileClick,
  showMenuButton = true,
  className = ""
}) => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div className="flex items-center space-x-2 py-1">
          <User size={16} />
          <span>Profile</span>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div className="flex items-center space-x-2 py-1 text-red-600">
          <LogOut size={16} />
          <span>Logout</span>
        </div>
      ),
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      onLogout?.();
    } else if (key === 'profile') {
      onProfileClick?.();
    }
  };

  return (
    <header className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 ${className}`}>
      <div className="flex items-center space-x-4">
        {showMenuButton && (
          <Button
            type="text"
            icon={<MenuIcon size={20} />}
            onClick={onToggleSidebar}
            className="lg:hidden"
          />
        )}
        <h2 className="text-lg font-semibold text-gray-900 font-sans">{pageTitle}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <Dropdown
          menu={{ items: menuItems, onClick: handleMenuClick }}
          placement="bottomRight"
          arrow
        >
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 font-sans">{userName}</p>
              <p className="text-xs text-gray-500 font-sans">{userRole}</p>
            </div>
            <Avatar 
              size={40} 
              src={userAvatar}
              style={{ 
                backgroundColor: userAvatar ? undefined : '#1890ff',
                fontSize: '16px'
              }}
            >
              {!userAvatar && userName.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default HeaderAvatar;