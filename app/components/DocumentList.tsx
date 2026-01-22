'use client';

import InfoModal from './InfoModal';
import {
  getDocuments,
  getDocumentsByParent,
  deleteDocument,
  getBinDocuments,
  restoreDocument,
  getDocumentsByTitle,
} from '@/lib/api';
import { formatDate, toTitleCase } from '@/lib/utils';
import { useDocuments } from '@/lib/DocumentContext';
import type { Document } from '@/types/document';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';

interface DocumentListProps {
  docs?: Document[];
}

export default function DocumentList({
  docs: initialDocs,
}: DocumentListProps) {
  const { docs, setDocs, currFolderId, setCurrFolderId, currFolderTitle, setCurrFolderTitle, folderPath, setFolderPath } = useDocuments();

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState('');
  const [modalState, setModalState] = useState<'success' | 'failure'>(
    'success'
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('search');
  const isBin = currFolderTitle === 'Bin';

  useEffect(() => {
    async function fetchDocuments() {
      try {
        // Fetch documents based on view or folder parameter
        let docs;
        if (isBin) {
          docs = await getBinDocuments();
        } else if (searchQuery) {
          docs = await getDocumentsByTitle(searchQuery);
        } else if (currFolderId) {
          docs = Number.isNaN(currFolderId)
            ? await getDocuments()
            : await getDocumentsByParent(currFolderId);
        } else {
          docs = await getDocuments();
        }

        console.log(docs);

        // Sort: folders first, then alphabetically
        const sorted = [...docs].sort((a, b) => {
          if (a.itemType === 'folder' && b.itemType !== 'folder') return -1;
          if (a.itemType !== 'folder' && b.itemType === 'folder') return 1;
          return a.title.localeCompare(b.title);
        });

        setDocs(sorted);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    }

    fetchDocuments();
  }, [currFolderId, searchQuery, isBin]);

  const handleOpen = (item: Document) => {
    if (item.s3Url) {
      window.open(item.s3Url, '_blank');
    }
  };

  const handleClick = async (item: Document) => {
    if (item.itemType === 'folder') {
      setCurrFolderId(item.id);
      setCurrFolderTitle(item.title)
      setFolderPath([...(folderPath || []), { folderId: item.id, folderTitle: item.title }]);
    }
  };

  const handleDelete = async (item: Document) => {
    try {
      await deleteDocument(item.id);

      // Refetch documents after deletion (respect view/folder)
      let docs;
      if (isBin) {
        docs = await getBinDocuments();
      } else if (currFolderId) {
        docs = Number.isNaN(currFolderId)
          ? await getDocuments()
          : await getDocumentsByParent(currFolderId);
      } else {
        docs = await getDocuments();
      }

      const sorted = [...docs].sort((a, b) => {
        if (a.itemType === 'folder' && b.itemType !== 'folder') return -1;
        if (a.itemType !== 'folder' && b.itemType === 'folder') return 1;
        return a.title.localeCompare(b.title);
      });

      setDocs(sorted);

      // Show success modal
      setModalTitle('Successful Deletion');
      setModalMsg(
        `${toTitleCase(item.itemType)} ${item.title} has been moved to Bin`
      );
      setModalState('success');
      setShowModal(true);
    } catch (error) {
      console.error('Failed to delete document:', error);
      setModalTitle('Failed to Delete Document');
      setModalMsg(
        `${toTitleCase(item.itemType)} ${item.title} has not been deleted`
      );
      setModalState('failure');
      setShowModal(true);
    }
  };

  const handleRestore = async (item: Document) => {
    try {
      await restoreDocument(item.id);

      // Refetch documents after deletion (respect view/folder)
      let docs;
      if (isBin) {
        docs = await getBinDocuments();
      } else if (currFolderId) {
        docs = Number.isNaN(currFolderId)
          ? await getDocuments()
          : await getDocumentsByParent(currFolderId);
      } else {
        docs = await getDocuments();
      }

      const sorted = [...docs].sort((a, b) => {
        if (a.itemType === 'folder' && b.itemType !== 'folder') return -1;
        if (a.itemType !== 'folder' && b.itemType === 'folder') return 1;
        return a.title.localeCompare(b.title);
      });

      setDocs(sorted);

      // Show success modal
      setModalTitle('Successful Restoration');
      setModalMsg(
        `${toTitleCase(item.itemType)} ${item.title} has been restored`
      );
      setModalState('success');
      setShowModal(true);
    } catch (error) {
      console.error('Failed to delete document:', error);
      setModalTitle('Failed to Delete Document');
      setModalMsg(
        `${toTitleCase(item.itemType)} ${item.title} has not been deleted`
      );
      setModalState('failure');
      setShowModal(true);
    }
  };

  return (
    <>
      <InfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        msg={modalMsg}
        state={modalState}
      />

      {/* Table for larger screens */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="table-header">Title</th>
              <th className="table-header">Updated At</th>
              <th className="table-header">Size</th>
              <th className="table-header">Owner</th>
              <th className="table-header-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {docs.map((doc) => (
              <tr
                key={doc.id}
                onClick={() => (!isBin ? handleClick(doc) : null)}
                className="hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {doc.itemType === 'folder' ? (
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
                    <span className="text-sm font-medium text-gray-900">
                      {doc.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {formatDate(doc.updatedAt)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {doc.fileSizeKb}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {doc.createdBy}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center">
                  {!isBin ? (
                    <>
                      {doc.itemType === 'file' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(doc);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                        >
                          Open
                        </button>
                      ) : null}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc);
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
                        handleRestore(doc);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                    >
                      Restore
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="md:hidden space-y-3">
        {docs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => (!isBin ? handleClick(doc) : null)}
            className="bg-white rounded-lg shadow p-4 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                {doc.itemType === 'folder' ? (
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
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Updated: {formatDate(doc.updatedAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {doc.fileSizeKb}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              {!isBin ? (
                <>
                  {doc.itemType === 'file' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(doc);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
                    >
                      Open
                    </button>
                  ) : null}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc);
                    }}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(doc);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
                >
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
