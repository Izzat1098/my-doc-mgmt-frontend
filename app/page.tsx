'use client';

import { useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DocumentList from './components/DocumentList';
import AddFolderModal from './components/AddFolderModal';
import { createFolder, createFile } from '@/lib/api';
import { uploadToS3 } from '@/lib/s3';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const folderId = searchParams.get('folder');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFolder = async (folderName: string) => {
    try {
      const parentId = folderId ? parseInt(folderId, 10) : undefined;
      await createFolder(folderName, parentId);
      setRefreshKey(prev => prev + 1); // Trigger refresh

    } catch (error) {
      console.error('Failed to create folder:', error);
      alert('Failed to create folder');
    }
  };

  const handleAddFile = () => {
    // Trigger file picker
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please select a smaller file.`);
      event.target.value = ''; // Reset input
      return;
    }

    try {
      const parentId = folderId ? parseInt(folderId, 10) : undefined;
      const file_size_kb = Math.round(file.size / 1024); // Convert bytes to KB
      const { document, uploadUrl } = await createFile(file.name, file_size_kb, parentId);

      // upload file to s3
      try {
        await uploadToS3(uploadUrl, file);
      } catch (uploadError) {
        console.error('Failed to upload file to S3:', uploadError);
        alert('File created but upload to S3 failed');
      }

      setRefreshKey(prev => prev + 1); // Trigger refresh
      event.target.value = ''; // Reset input

    } catch (error) {
      console.error('Failed to create file:', error);
      alert('Failed to create file');
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <AddFolderModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSubmit={handleAddFolder}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Documents</h1>
          <p className="text-gray-600">Manage your files and folders</p>
        </div>
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => setShowFolderModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Folder
          </button>
          <button
            onClick={handleAddFile}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add File
          </button>
        </div>
      </div>
      <DocumentList key={refreshKey} />
    </div>
  );
}
