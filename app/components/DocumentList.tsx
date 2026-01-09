'use client';

interface Document {
  id: number;
  name: string;
  type: 'folder' | 'file';
  modified: string;
  size: string;
  owner: string;
}

interface DocumentListProps {
  items?: Document[];
}

// just some mock data for now
const documents = [
  { id: 1, name: 'Project Proposals', type: 'folder' as const, modified: '2026-01-05', size: '-', owner: 'Newmon' },
  { id: 2, name: 'Meeting Notes.docx', type: 'file' as const, modified: '2026-01-08', size: '45 KB', owner: 'John'  },
  { id: 3, name: 'Budget 2026.xlsx', type: 'file' as const, modified: '2026-01-07', size: '128 KB', owner: 'Mew'  },
  { id: 4, name: 'Photos', type: 'folder' as const, modified: '2026-01-03', size: '-', owner: 'Kate'  },
  { id: 5, name: 'Presentation.pptx', type: 'file' as const, modified: '2026-01-09', size: '2.4 MB', owner: 'Lilly'  },
];

export default function DocumentList({ items = [] }: DocumentListProps) {
  
  // replace this with actual api call
  items = [...documents].sort((a, b) => {
    // Folders first
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    // Then alphabetically by name
    return a.name.localeCompare(b.name);
  })

  const handleOpen = (item: Document) => {
    console.log('Opening:', item.name);
    // Handle open logic
  };

  const handleDelete = (item: Document) => {
    console.log('Deleting:', item.name);
    // Handle delete logic
  };

  return (
    <>
      {/* Table for larger screens */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Modified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {item.type === 'folder' ? (
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
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{item.modified}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{item.size}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{item.owner}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleOpen(item)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Open
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="md:hidden space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                {item.type === 'folder' ? (
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
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500">Modified: {item.modified}</p>
                  <p className="text-xs text-gray-500">Size: {item.size}</p>
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
                onClick={() => handleOpen(item)}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
              >
                Open
              </button>
              <button 
                onClick={() => handleDelete(item)}
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
