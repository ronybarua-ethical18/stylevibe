import Image from 'next/image';
import React, { useState, ChangeEvent } from 'react';
import { PiPlus, PiPencilSimple, PiTrash } from 'react-icons/pi';

interface ProfilePhotoUploadProps {
  maxSizeInMB?: number;
  photoUrl: string | null;
  setPhotoUrl: (url: string | null) => void;
}

const SVProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  maxSizeInMB = 5,
  photoUrl,
  setPhotoUrl,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`File size should not exceed ${maxSizeInMB}MB`);
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('img', file);

    try {
      const response = await fetch(
        'https://stylevibe-backend-production.up.railway.app/api/v1/uploads',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setPhotoUrl(data?.data);
    } catch {
      setError('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    setPhotoUrl(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center group">
        {photoUrl ? (
          <>
            <Image
              src={photoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              width={80}
              height={80}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <label
                htmlFor="photo-upload"
                className="cursor-pointer p-1 bg-white rounded-full mr-2"
              >
                <PiPencilSimple className="text-gray-700" size={16} />
              </label>
              <button
                onClick={handleDelete}
                className="p-1 bg-white rounded-full"
              >
                <PiTrash className="text-gray-700" size={16} />
              </button>
            </div>
          </>
        ) : (
          <label htmlFor="photo-upload" className="cursor-pointer">
            {isUploading ? (
              <span className="text-gray-400">Uploading...</span>
            ) : (
              <PiPlus className="text-gray-400" size={24} />
            )}
          </label>
        )}
      </div>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
        disabled={isUploading}
      />
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default SVProfilePhotoUpload;
