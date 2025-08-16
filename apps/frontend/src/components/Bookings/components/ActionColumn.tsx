import React, { memo } from 'react';
import { LiaEdit } from 'react-icons/lia';
import { BiChat } from 'react-icons/bi';
import { Badge, Tooltip } from 'antd';
import { SVDrawer } from '@/components/ui/SVDrawer';
import { ChatWindow } from '@/chat/ChatWindow';
import { useChatLogic } from '../hooks/useChatLogic';

interface ActionColumnProps {
  record: any;
  loggedInUser: { role: string };
  handleEditClick: (record: any) => void;
}

export const ActionColumn = memo(
  ({ record, loggedInUser, handleEditClick }: ActionColumnProps) => {
    const { senderId, receiverId, chatUserInfo, isSeller } = useChatLogic(
      record,
      loggedInUser
    );

    return (
      <div className="flex justify-end">
        <div className="flex align-baseline">
          <SVDrawer
            title=""
            placement="right"
            width={600}
            trigger={
              <Tooltip
                placement="topLeft"
                title={`Chat with ${chatUserInfo?.role.toLowerCase()}`}
                arrow={true}
              >
                <Badge
                  count={1}
                  size="small"
                  color="blue"
                  className="cursor-pointer mr-3"
                >
                  <BiChat className="text-xl cursor-pointer text-blue-500 hover:text-blue-700" />
                </Badge>
              </Tooltip>
            }
          >
            <div className="h-full">
              <ChatWindow
                senderId={senderId}
                receiverId={receiverId}
                bookingId={record?._id}
                customerInfo={chatUserInfo}
              />
            </div>
          </SVDrawer>
          {isSeller && (
            <LiaEdit
              className="text-xl cursor-pointer"
              onClick={() => handleEditClick(record)}
            />
          )}
        </div>
      </div>
    );
  }
);

ActionColumn.displayName = 'ActionColumn';
