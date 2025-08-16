import { useMemo } from 'react';

export const useChatLogic = (record: any, loggedInUser: { role: string }) => {
  return useMemo(() => {
    const sellerId = record?.seller?._id || record?.seller;
    const customerId = record?.customer?._id;
    const customerName = `${record?.customer?.firstName} ${record?.customer?.lastName}`;
    const customerAvatar = record?.customer?.img;
    const sellerName = `${record?.seller?.firstName} ${record?.seller?.lastName}`;
    const sellerAvatar = record?.seller?.img;

    const isSeller = loggedInUser?.role === 'seller';
    const senderId = isSeller ? sellerId : customerId;
    const receiverId = isSeller ? customerId : sellerId;

    const chatUserInfo = {
      name: isSeller ? customerName : sellerName,
      avatar: isSeller ? customerAvatar : sellerAvatar,
      role: isSeller ? 'customer' : 'seller',
    };

    return { senderId, receiverId, chatUserInfo, isSeller };
  }, [record, loggedInUser?.role]);
};
