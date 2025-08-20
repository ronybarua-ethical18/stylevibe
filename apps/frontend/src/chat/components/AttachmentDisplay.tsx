import React from 'react';
import { Button, Tooltip } from 'antd';
import {
  DownloadOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  EyeOutlined,
} from '@ant-design/icons';

interface Attachment {
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

interface AttachmentDisplayProps {
  attachments: Attachment[];
  isOwnMessage?: boolean;
}

const AttachmentDisplay: React.FC<AttachmentDisplayProps> = ({
  attachments,
  isOwnMessage = false,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FileImageOutlined />;
    if (mimeType === 'application/pdf') return <FilePdfOutlined />;
    if (mimeType.includes('word')) return <FileWordOutlined />;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
      return <FileExcelOutlined />;
    if (mimeType.startsWith('video/')) return <PlayCircleOutlined />;
    if (mimeType.startsWith('audio/')) return <SoundOutlined />;
    return <FileOutlined />;
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-1">
      {attachments.map((attachment, index) => {
        if (attachment.type === 'image') {
          return (
            <div key={index} className="relative group">
              <img
                src={attachment.url}
                alt={attachment.filename}
                className="max-w-[200px] max-h-[200px] rounded-lg cursor-pointer object-cover"
                onClick={() => handlePreview(attachment.url)}
                style={{ minWidth: '120px', minHeight: '80px' }}
              />
              {/* Overlay buttons on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Tooltip title="View">
                    <Button
                      type="primary"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreview(attachment.url)}
                      className="bg-white bg-opacity-90 border-0 text-gray-700 hover:bg-opacity-100"
                    />
                  </Tooltip>
                  <Tooltip title="Download">
                    <Button
                      type="primary"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() =>
                        handleDownload(attachment.url, attachment.filename)
                      }
                      className="bg-white bg-opacity-90 border-0 text-gray-700 hover:bg-opacity-100"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        }

        if (attachment.type === 'video') {
          return (
            <div key={index} className="relative">
              <video
                controls
                className="max-w-[250px] max-h-[200px] rounded-lg"
                style={{ minWidth: '120px', minHeight: '80px' }}
              >
                <source src={attachment.url} type={attachment.mimeType} />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }

        if (attachment.type === 'audio') {
          return (
            <div key={index} className="w-full max-w-[250px]">
              <audio controls className="w-full">
                <source src={attachment.url} type={attachment.mimeType} />
                Your browser does not support the audio tag.
              </audio>
            </div>
          );
        }

        // Document files - compact style like Facebook Messenger
        return (
          <div
            key={index}
            className={`flex items-center p-2 rounded-lg border max-w-[250px] cursor-pointer hover:shadow-sm transition-shadow ${
              isOwnMessage
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => handlePreview(attachment.url)}
          >
            <div
              className={`text-lg mr-3 ${isOwnMessage ? 'text-blue-600' : 'text-gray-600'}`}
            >
              {getFileIcon(attachment.mimeType)}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  isOwnMessage ? 'text-blue-900' : 'text-gray-900'
                }`}
                title={attachment.filename}
              >
                {attachment.filename}
              </p>
              <p
                className={`text-xs ${isOwnMessage ? 'text-blue-700' : 'text-gray-500'}`}
              >
                {formatFileSize(attachment.size)}
              </p>
            </div>
            <Tooltip title="Download">
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(attachment.url, attachment.filename);
                }}
                className={`ml-2 ${
                  isOwnMessage
                    ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              />
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentDisplay;
