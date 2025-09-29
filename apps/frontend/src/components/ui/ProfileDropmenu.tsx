import React from 'react';
import { Dropdown, Avatar, Typography, Divider, theme } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  LogoutOutlined,
  SearchOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Text, Title } = Typography;

interface ProfileDropmenuProps {
  user: {
    name: string;
    email: string;
    img?: string;
    isOnline?: boolean;
    role?: string;
  };
  onMenuClick?: (key: string) => void;
  reverseLayout?: boolean;
  isHomepage?: boolean;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  group?: number;
  showOnHomepage?: boolean;
}

const ProfileDropmenu: React.FC<ProfileDropmenuProps> = ({
  user,
  onMenuClick,
  reverseLayout = false,
  isHomepage = false,
}) => {
  const { token } = theme.useToken();

  const menuItems: MenuItem[] = [
    // First group
    {
      key: 'go-to-dashboard',
      icon: <DashboardOutlined />,
      label: 'Go to Dashboard',
      shortcut: '⌘ + H',
      group: 1,
      showOnHomepage: true,
    },
    {
      key: 'view-profile',
      icon: <SearchOutlined />,
      label: 'View Profile',
      shortcut: '⌘ + F',
      group: 1,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      shortcut: '⌘ + G',
      group: 1,
    },
    {
      key: 'subscription',
      icon: <CreditCardOutlined />,
      label: 'Subscription',
      shortcut: '⌘ + D',
      group: 1,
    },

    // Third group
    {
      key: 'support',
      icon: <CustomerServiceOutlined />,
      label: 'Support',
      shortcut: '⌘ + R',
      group: 3,
    },
    {
      key: 'community',
      icon: <MessageOutlined />,
      label: 'Community',
      shortcut: '⌘ + P',
      group: 3,
    },
    {
      key: 'sign-out',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      shortcut: '⌘ + F',
      group: 3,
    },
  ];

  const generateMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [];
    let currentGroup = 0;

    // Filter menu items based on homepage condition
    const filteredMenuItems = menuItems.filter((item) => {
      if (item.showOnHomepage) {
        return isHomepage;
      }
      return true;
    });

    filteredMenuItems.forEach((item) => {
      // Add divider between groups
      if (item.group && item.group > currentGroup && currentGroup > 0) {
        items.push({
          type: 'divider',
          key: `divider-${item.group}`,
        });
      }

      items.push({
        key: item.key,
        label: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              width: '100%',
              cursor: 'pointer',
              borderRadius: '6px',
              paddingLeft: '8px',
              paddingRight: '8px',
              transition: 'all 0.2s ease',
            }}
            className="menu-item-hover"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '16px',
                  color: token.colorTextSecondary,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.icon}
              </span>
              <Text
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: token.colorText,
                }}
              >
                {item.label}
              </Text>
            </div>
            <Text
              style={{
                fontSize: '12px',
                color: token.colorTextTertiary,
                fontFamily: 'monospace',
              }}
            >
              {item.shortcut}
            </Text>
          </div>
        ),
        onClick: () => onMenuClick?.(item.key),
      });

      currentGroup = item.group || 0;
    });

    return items;
  };

  const dropdownOverlay = (
    <div
      style={{
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorBgElevated} 100%)`,
        borderRadius: '12px',
        padding: '10px',
        minWidth: '270px',
        boxShadow: token.boxShadowSecondary,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      {/* User Profile Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // marginBottom: '10px',
          paddingBottom: '16px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Avatar
            size={64}
            src={user.img}
            icon={<UserOutlined />}
            style={{
              boxShadow: token.boxShadowSecondary,
            }}
          />
        </div>
        <Title
          level={5}
          style={{ color: token.colorText, marginBottom: '0px' }}
        >
          {user.name}
        </Title>
        <Text
          style={{
            fontSize: '13px',
            color: token.colorTextSecondary,
          }}
        >
          {user.email}
        </Text>
      </div>

      {/* Menu Items */}
      <div
        style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {generateMenuItems()?.map((item, index) =>
          item && item.type === 'divider' ? (
            <Divider
              key={index}
              style={{
                margin: '0',
                borderColor: token.colorBorderSecondary,
              }}
            />
          ) : item && item.label ? (
            <div key={index} onClick={() => (item as any).onClick?.()}>
              {item.label}
            </div>
          ) : null
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={dropdownOverlay}
      placement="bottomRight"
      trigger={['click']}
      overlayStyle={{ padding: 0 }}
    >
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexDirection: reverseLayout ? 'row-reverse' : 'row',
        }}
      >
        <Avatar
          size={40}
          src={user.img}
          icon={<UserOutlined />}
          style={{
            backgroundColor: token.colorPrimary,
            cursor: 'pointer',
            boxShadow: token.boxShadowSecondary,
          }}
        />
        <div>
          <h5 style={{ margin: 0, fontSize: '14px', color: token.colorText }}>
            {user.name}
          </h5>
          <h6
            style={{
              margin: 0,
              fontWeight: 400,
              fontSize: '12px',
              textAlign: reverseLayout ? 'right' : 'left',
              color: token.colorTextSecondary,
            }}
          >
            {user.role}
          </h6>
        </div>
      </div>
    </Dropdown>
  );
};

export default ProfileDropmenu;
