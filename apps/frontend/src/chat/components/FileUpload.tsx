'use client';
import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { PaperClipOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { getBaseUrl } from '@/config/envConfig';

interface FileUploadProps {
  onFilesUploaded: (attachments: any[]) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUploaded,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);

  const getFileTypeCategory = (
    mimeType: string
  ): 'image' | 'document' | 'video' | 'audio' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const uploadProps: UploadProps = {
    name: 'img',
    action: `${getBaseUrl()}/uploads`, // Use environment variable instead of hardcoded URL
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      // Check file size (max 10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return false;
      }
      return true;
    },
    onChange: (info) => {
      const { status } = info.file;

      if (status === 'uploading') {
        setUploading(true);
      }

      if (status === 'done') {
        const allDone = info.fileList.every(
          (f) => f.status === 'done' || f.status === 'error'
        );

        if (allDone) {
          setUploading(false);

          // Process successful uploads from current upload session only
          const successfulUploads = info.fileList
            .filter((f) => f.status === 'done' && f.response?.data)
            .map((f) => ({
              type: getFileTypeCategory(f.type || ''),
              url: f.response.data,
              filename: f.name,
              size: f.size || 0,
              mimeType: f.type || 'application/octet-stream',
            }));

          if (successfulUploads.length > 0) {
            // Replace previous attachments instead of appending
            onFilesUploaded(successfulUploads);
            message.success(
              `${successfulUploads.length} file(s) uploaded successfully!`
            );
          }

          // Show errors for failed uploads
          const failedUploads = info.fileList.filter(
            (f) => f.status === 'error'
          );
          if (failedUploads.length > 0) {
            message.error(`${failedUploads.length} file(s) failed to upload`);
          }
        }
      }

      if (status === 'error') {
        setUploading(false);
        const errorMsg =
          info.file.response?.message ||
          info.file.error?.message ||
          'Upload failed';
        message.error(`${info.file.name}: ${errorMsg}`);
      }
    },
  };

  return (
    <>
      <Upload {...uploadProps} disabled={disabled || uploading}>
        <Button
          type="text"
          icon={uploading ? <LoadingOutlined /> : <PaperClipOutlined />}
          className="text-gray-400 hover:text-gray-600"
          disabled={disabled}
          title="Attach files"
        />
      </Upload>
    </>
  );
};

export default FileUpload;
