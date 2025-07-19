import { Avatar, Button, Dropdown, MenuProps, Space } from 'antd'
import { useRouter } from 'next/navigation'
import { UserOutlined, BellOutlined } from '@ant-design/icons'
import React from 'react'
import { removeUserInfo } from '@/utils/handleLocalStorage'
import { authKey } from '@/constants/authKey'
import { getUserInfo } from '@/services/auth.service'

export default function SVTopbar() {
  const router = useRouter()
  const userDetails:any = getUserInfo()
    const logOut = () => {
    removeUserInfo(authKey)
    router.push('/login')
  }
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button type="text" onClick={() => logOut()}>
          Logout
        </Button>
      ),
    },
  ]
  return (
    <div
      style={{
        background: 'white',
        width: '100%',
        padding: '10px 25px',
        position: 'fixed',
        textAlign: 'right',
        display: 'flex',
        justifyContent: 'flex-end',
        top: 0,
        left: 0,
        zIndex: 9998,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BellOutlined style={{ fontSize: '25px' }} />
        <Dropdown menu={{ items }}>
          <a onClick={e => e.preventDefault()}>
            <Space>
              <Avatar
                style={{ backgroundColor: '#87d068', margin: '0px 10px' }}
                icon={<UserOutlined />}
              />
            </Space>
          </a>
        </Dropdown>

        <div>
          <h5 style={{ margin: 0, fontSize: '14px' }}>{userDetails?.firstName + " "+ userDetails?.lastName}</h5>
          <h6
            style={{
              margin: 0,
              fontWeight: 400,
              fontSize: '12px',
              textAlign: 'left',
            }}
          >
            {userDetails?.role}
          </h6>
        </div>
      </div>
    </div>
  )
}
