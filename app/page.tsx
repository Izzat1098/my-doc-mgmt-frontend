'use client';

import { useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DocumentList from './components/DocumentList';
import AddFolderModal from './components/AddFolderModal';
import { createFolder, createFile, getDocuments, getDocumentsByParent } from '@/lib/api';
import { uploadToS3 } from '@/lib/s3';
import { toTitleCase } from '@/lib/utils';
import InfoModal from './components/InfoModal';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const folderId = searchParams.get('folder');
  const view = searchParams.get('view');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState('');
  const [modalState, setModalState] = useState<'success' | 'failure'>('success');
  const isBin = view === 'bin';

  const handleAddFolder = async (folderName: string) => {
    try {
      const parentId = folderId ? parseInt(folderId, 10) : undefined;

      // Check if folder name already exists
      try {
        const existingDocs = parentId 
          ? await getDocumentsByParent(parentId)
          : await getDocuments();

        const folderExists = existingDocs.some(
          doc => doc.item_type === 'folder' && doc.title.toLowerCase() === folderName.toLowerCase()
        );
        if (folderExists) {
          setModalTitle("Folder Already Exists");
          setModalMsg(`A folder named "${folderName}" already exists in this location`);
          setModalState('failure');
          setShowModal(true);
          return;
        }

      } catch (error) {
        console.error('Error checking current file/folder list:', error);
        setModalTitle("Folder Creation Unsuccessful");
        setModalMsg(`Folder ${folderName} creation failed. Please try again`);
        setModalState('failure');
        setShowModal(true);
        return
      }

      await createFolder(folderName, parentId);
      setRefreshKey(prev => prev + 1); // Trigger refresh

      // Show success modal
      setModalTitle("Folder Added");
      setModalMsg(`Folder ${folderName} has been successfully added`);
      setModalState('success');
      
    } catch (error) {
      console.error('Failed to create folder:', error);
      setModalTitle("Folder Creation Unsuccessful");
      setModalMsg(`Folder ${folderName} creation failed. Please try again`);
      setModalState('failure');
      
    } finally {
      setShowModal(true);
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
      
      // Check if file name already exists
      try {
        const existingDocs = parentId 
          ? await getDocumentsByParent(parentId)
          : await getDocuments();
        console.log(existingDocs)

        const fileExists = existingDocs.some(
          doc => doc.item_type === 'file' && doc.title.toLowerCase() === file.name.toLowerCase()
        );
        if (fileExists) {
          setModalTitle("File Already Exists");
          setModalMsg(`A file named "${file.name}" already exists in this location`);
          setModalState('failure');
          setShowModal(true);
          return;
        }

      } catch (error) {
        console.error('Error checking current file/folder list:', error);
        setModalTitle("File Upload Unsuccessful");
        setModalMsg(`File ${file.name} upload failed. Please try again`);
        setModalState('failure');
        setShowModal(true);
        return
      }

      const { document, uploadUrl } = await createFile(file.name, file_size_kb, parentId);

      // upload file to s3
      const uploadStatus = await uploadToS3(uploadUrl, file);

      if (uploadStatus) {
        setModalTitle("File Successfully Added");
        setModalMsg(`File ${file.name} has been successfully added`);
        setModalState('success');
      } else {
        setModalTitle("File Upload Unsuccessful");
        setModalMsg(`File ${file.name} upload failed. Please try again`);
        setModalState('failure');
      }

      setShowModal(true);
      setRefreshKey(prev => prev + 1); // Trigger refresh

    } catch (error) {
      console.error('Failed to upload file:', error);
      setModalTitle("File Upload Unsuccessful");
      setModalMsg(`File ${file.name} upload failed. Please try again`);
      setModalState('failure');
      setShowModal(true);

    } finally {
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
      <InfoModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        msg={modalMsg}
        state={modalState}
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{isBin ? "Bin" : "My Documents"}</h1>
          <p className="text-gray-600">{isBin ? "Your deleted items" : "Manage your files and folders" }</p>
        </div>
        {!isBin ? (
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
        ) : null
        }
      </div>
      <DocumentList key={refreshKey} />
    </div>
  );
}
