'use client';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  action: 'deleted' | 'restored';
}

export default function SuccessModal({ isOpen, onClose, itemName, action }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Successfully {action === 'deleted' ? 'Deleted' : 'Restored'}
            </h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          <span className="font-semibold">{itemName}</span> has been {action}.
        </p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          OK
        </button>
      </div>
    </div>
  );
}
