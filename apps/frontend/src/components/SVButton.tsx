'use client'

import { Button } from 'antd'
import { ButtonType } from 'antd/es/button'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import React from 'react'

interface IButton {
  title: string
  type?: ButtonType
  style?: object
  size?: SizeType
  onClick?: any
  className?: any
  disabled?: any
  icon?: any
  loading?:any
  htmlType?:any
}
export default function SVButton({
  type,
  size,
  title,
  style,
  onClick,
  className,
  disabled,
  icon,
  loading,
  htmlType
}: IButton): React.ReactNode {
  return (
    <Button
      icon={icon}
      type={type || 'primary'}
      size={size || 'large'}
      style={{ ...style, fontSize: '12px' }}
      className={className}
      onClick={onClick}
      disabled={disabled}
      htmlType={htmlType}
    >
      {title}
    </Button>
  )
}
