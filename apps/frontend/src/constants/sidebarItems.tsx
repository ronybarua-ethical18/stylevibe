import type { MenuProps } from 'antd';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa6';
import { GrServices } from 'react-icons/gr';
import { IoSettingsOutline } from 'react-icons/io5';
import { LiaBlogSolid } from 'react-icons/lia';
import { MdOutlineQuestionAnswer } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { TbBrandBooking } from 'react-icons/tb';
import { TbTransactionRupee } from 'react-icons/tb';

import { UserRole } from './role';

export const sidebarItems = (role: string) => {
  const defaultSidebarItems: MenuProps['items'] = [
    {
      label: <Link href={`/${role}/dashboard`}>Dashboard</Link>,
      key: `/${role}/dashboard`,
      icon: <RxDashboard style={{ fontSize: '16px' }} />,
    },
    {
      label: <Link href={`/${role}/bookings`}>Bookings</Link>,
      key: `/${role}/bookings`,
      icon: <TbBrandBooking style={{ fontSize: '16px' }} />,
    },
    {
      label: <Link href={`/${role}/transactions`}>Transactions</Link>,
      key: `/${role}/transactions`,
      icon: <TbTransactionRupee style={{ fontSize: '16px' }} />,
    },
    // {
    //   label: <Link href={`/${role}/disputes`}>Disputes</Link>,
    //   key: `${role}/disputes`,
    //   icon:<VscSearchStop style={{ fontSize: '16px' }}/>,
    // },
  ];

  const customerSidebarItems: MenuProps['items'] = [
    ...defaultSidebarItems,
    {
      label: <Link href={`/${role}/settings`}>Settings</Link>,
      key: `/${role}/settings`,
      icon: <IoSettingsOutline style={{ fontSize: '16px' }} />,
    },
  ];

  const sellerSidebarItems: MenuProps['items'] = [
    ...defaultSidebarItems,
    {
      label: <Link href={`/${role}/services`}>Services</Link>,
      key: `/${role}/services`,
      icon: <GrServices style={{ fontSize: '16px' }} />,
    },
    {
      label: <Link href={`/${role}/customers`}>Customers</Link>,
      key: `/${role}/customers`,
      icon: <FaUsers style={{ fontSize: '16px' }} />,
    },
    {
      label: <Link href={`/${role}/settings`}>Settings</Link>,
      key: `/${role}/settings`,
      icon: <IoSettingsOutline style={{ fontSize: '16px' }} />,
    },
  ];

  const adminSidebarItems: MenuProps['items'] = [
    ...sellerSidebarItems,

    {
      label: <Link href={`/${role}/blogs`}>Blogs</Link>,
      key: `/${role}/blogs`,
      icon: <LiaBlogSolid style={{ fontSize: '16px' }} />,
    },
    {
      label: <Link href={`/${role}/faqs`}>FAQ</Link>,
      key: `/${role}/faqs`,
      icon: <MdOutlineQuestionAnswer style={{ fontSize: '16px' }} />,
    },
  ];

  const superAdminSiderbarItems: MenuProps['items'] = [
    ...adminSidebarItems,
    {
      label: <Link href={`/${role}/manage-orders`}>Manage Bookings</Link>,
      key: `/${role}/manage-orders`,
    },
    {
      label: <Link href={`/${role}/manage-sellers`}>Manage Sellers</Link>,
      key: `/${role}/manage-sellers`,
    },
    {
      label: <Link href={`/${role}/manage-customers`}>Manage Customers</Link>,
      key: `/${role}/manage-customers`,
    },
    {
      label: <Link href={`/${role}/manage-admins`}>Manage Admins</Link>,
      key: `/${role}/manage-admins`,
    },
  ];

  if (role === UserRole.USER) return defaultSidebarItems;
  else if (role === UserRole.CUSTOMER) return customerSidebarItems;
  else if (role === UserRole.SELLER) return sellerSidebarItems;
  else if (role === UserRole.ADMIN) return adminSidebarItems;
  else if (role === UserRole.SUPER_ADMIN) return superAdminSiderbarItems;
  else return defaultSidebarItems;
};
