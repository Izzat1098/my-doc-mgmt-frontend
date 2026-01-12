'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getDocuments, getDocumentsByParent, deleteDocument, getBinDocuments, restoreDocument } from '@/lib/api';
import type { Document } from '@/types/document';
import { formatDate } from '@/lib/utils';
import SuccessModal from './SuccessModal';

interface DocumentListProps {
  items?: Document[];
}

export default function DocumentList({ items: initialItems }: DocumentListProps) {
  const [items, setItems] = useState<Document[]>(initialItems || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalItemName, setModalItemName] = useState('');
  const [modalAction, setModalAction] = useState<'deleted' | 'restored'>('deleted');
  const searchParams = useSearchParams();
  const router = useRouter();
  const folderId = searchParams.get('folder');
  const view = searchParams.get('view');

  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        
        // Fetch documents based on view or folder parameter
        let docs;
        if (view === 'bin') {
          docs = await getBinDocuments();
        } else if (folderId) {
          const parsedId = parseInt(folderId, 10);
          docs = Number.isNaN(parsedId) ? await getDocuments() : await getDocumentsByParent(parsedId);
        } else {
          docs = await getDocuments();
        }
        
        // Sort: folders first, then alphabetically
        const sorted = [...docs].sort((a, b) => {
          if (a.item_type === 'folder' && b.item_type !== 'folder') return -1;
          if (a.item_type !== 'folder' && b.item_type === 'folder') return 1;
          return a.title.localeCompare(b.title);
        });
        
        setItems(sorted);
        setError(null);

      } catch (err) {
        setError('Failed to load documents');
        console.error('Error fetching documents:', err);

      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [folderId, view])

  const handleOpen = (item: Document) => {
    console.log('Opening:', item.title);
    // Handle open logic
  };

  const handleClick = async (item: Document) => {
    if (item.item_type === 'folder') {
      // Update URL to navigate to folder
      router.push(`/?folder=${item.id}`);
    }
  };

  const handleDelete = async (item: Document) => {
    try {
      await deleteDocument(item.id);
      
      // Refetch documents after deletion (respect view/folder)
      setLoading(true);
      let docs;
      if (view === 'bin') {
        docs = await getBinDocuments();
      } else if (folderId) {
        const parsedId = parseInt(folderId, 10);
        docs = Number.isNaN(parsedId) ? await getDocuments() : await getDocumentsByParent(parsedId);
      } else {
        docs = await getDocuments();
      }
      
      const sorted = [...docs].sort((a, b) => {
        if (a.item_type === 'folder' && b.item_type !== 'folder') return -1;
        if (a.item_type !== 'folder' && b.item_type === 'folder') return 1;
        return a.title.localeCompare(b.title);
      });
      
      setItems(sorted);
      setLoading(false);
      
      // Show success modal
      setModalItemName(item.title);
      setModalAction('deleted');
      setShowModal(true);
    } catch (error) {
      console.error('Failed to delete document:', error);
      setLoading(false);
    }
  };

  const handleRestore = async (item: Document) => {
    try {
      await restoreDocument(item.id);
      
      // Refetch documents after deletion (respect view/folder)
      setLoading(true);
      let docs;
      if (view === 'bin') {
        docs = await getBinDocuments();
      } else if (folderId) {
        const parsedId = parseInt(folderId, 10);
        docs = Number.isNaN(parsedId) ? await getDocuments() : await getDocumentsByParent(parsedId);
      } else {
        docs = await getDocuments();
      }
      
      const sorted = [...docs].sort((a, b) => {
        if (a.item_type === 'folder' && b.item_type !== 'folder') return -1;
        if (a.item_type !== 'folder' && b.item_type === 'folder') return 1;
        return a.title.localeCompare(b.title);
      });
      
      setItems(sorted);
      setLoading(false);
      
      // Show success modal
      setModalItemName(item.title);
      setModalAction('restored');
      setShowModal(true);
    } catch (error) {
      console.error('Failed to delete document:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        itemName={modalItemName}
        action={modalAction}
      />

      {/* Table for larger screens */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="table-header">
                Title
              </th>
              <th className="table-header">
                Updated At
              </th>
              <th className="table-header">
                Size
              </th>
              <th className="table-header">
                Owner
              </th>
              <th className="table-header-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => handleClick(item)}
                className="hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {item.item_type === 'folder' ? (
                      <svg
                        className="w-5 h-5 text-blue-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-400 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="text-sm font-medium text-gray-900">{item.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{formatDate(item.updated_at)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{item.file_size_kb}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{item.created_by}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {view !== "bin" ? (
                    <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(item);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                    >
                      Open
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Delete
                    </button>
                    </>
                    ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(item);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                    >
                      Restore
                    </button>
                    )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="md:hidden space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleClick(item)}
            className="bg-white rounded-lg shadow p-4 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                {item.item_type === 'folder' ? (
                  <svg
                    className="w-6 h-6 text-blue-500 mr-3 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-400 mr-3 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500">Updated: {formatDate(item.updated_at)}</p>
                  <p className="text-xs text-gray-500">Size: {item.file_size_kb}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(item);
                }}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
              >
                Open
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
