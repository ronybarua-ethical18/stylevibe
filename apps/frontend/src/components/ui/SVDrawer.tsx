'use client';
import React, { useState } from 'react';
import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';

interface SVDrawerProps {
  title?: string;
  children: React.ReactNode;
  placement?: DrawerProps['placement'];
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  className?: string;
  styles?: DrawerProps['styles'];
  trigger?: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}

export const SVDrawer: React.FC<SVDrawerProps> = ({
  title = 'Drawer',
  children,
  placement = 'right',
  width = 400,
  height,
  maskClosable = true,
  destroyOnClose = true,
  className,
  styles,
  trigger,
  onOpen,
  onClose,
}) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      {trigger ? (
        <div onClick={showDrawer} className="cursor-pointer">
          {trigger}
        </div>
      ) : null}

      <Drawer
        title={title}
        placement={placement}
        closable={false} // This removes the default close icon
        onClose={handleClose}
        open={open}
        width={width}
        height={height}
        maskClosable={maskClosable}
        destroyOnClose={destroyOnClose}
        className={className}
        styles={styles}
      >
        {children}
      </Drawer>
    </>
  );
};

export default SVDrawer;
