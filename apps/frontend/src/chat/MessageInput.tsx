'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button, Tooltip, message, Tag } from 'antd';
import { SendOutlined, SmileOutlined, CloseOutlined } from '@ant-design/icons';
import { socket } from './chatSocket';
import { useSendMessageMutation } from '@/redux/api/chat';
import FileUpload from './components/FileUpload';

const { TextArea } = Input;

interface MessageInputProps {
  senderId: string;
  receiverId: string;
  bookingId: string;
}

interface Attachment {
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  senderId,
  receiverId,
  bookingId,
}) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSend = async () => {
    // Updated validation: Allow attachment-only messages
    const hasText = messageText.trim().length > 0;
    const hasAttachments = attachments.length > 0;

    if (!hasText && !hasAttachments) return;

    const textToSend = messageText.trim();
    const attachmentsToSend = [...attachments];

    // Determine message type automatically
    let messageType: 'text' | 'attachment' | 'mixed' = 'text';
    if (hasAttachments && hasText) {
      messageType = 'mixed';
    } else if (hasAttachments && !hasText) {
      messageType = 'attachment';
    }

    try {
      await sendMessage({
        senderId,
        receiverId,
        message: textToSend,
        attachments: attachmentsToSend,
        messageType,
        bookingId,
      }).unwrap();

      // Clear inputs only AFTER successful sending
      setMessageText('');
      setAttachments([]);
    } catch (error: any) {
      message.error(
        `Failed to send message: ${error?.data?.message || error?.message || 'Unknown error'}`
      );
      // Don't restore anything - keep the current state so user can retry
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFilesUploaded = (newAttachments: Attachment[]) => {
    // Allow multiple files in one upload session
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const canSendMessage = Boolean(
    senderId && receiverId && bookingId && !isLoading
  );

  // Update the send button condition
  const hasContent = messageText.trim().length > 0 || attachments.length > 0;

  // Typing indicator effect
  useEffect(() => {
    if (!senderId || !receiverId || !bookingId) return;

    let typingTimer: NodeJS.Timeout | undefined;
    const roomId = `booking_${bookingId}`;

    if (messageText.length > 0) {
      socket?.emit('typing_start', { conversationId: roomId });
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        socket?.emit('typing_stop', { conversationId: roomId });
      }, 1000);
    } else {
      socket?.emit('typing_stop', { conversationId: roomId });
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [messageText, senderId, receiverId, bookingId]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removeAttachment(index)}
                closeIcon={<CloseOutlined />}
                className="flex items-center max-w-xs"
              >
                <span className="truncate" title={attachment.filename}>
                  {attachment.filename} ({formatFileSize(attachment.size)})
                </span>
              </Tag>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <TextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={canSendMessage ? 'Type your message...' : 'Loading...'}
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
            disabled={!canSendMessage}
          />
        </div>

        <div className="flex space-x-1">
          <FileUpload
            onFilesUploaded={handleFilesUploaded}
            disabled={!canSendMessage}
          />

          <Tooltip title="Emoji">
            <Button
              type="text"
              icon={<SmileOutlined />}
              className="text-gray-400 hover:text-gray-600"
              disabled={!canSendMessage}
            />
          </Tooltip>

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            disabled={!canSendMessage || !hasContent}
            className="rounded-full bg-blue-500 hover:bg-blue-600 border-0 shadow-sm"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
