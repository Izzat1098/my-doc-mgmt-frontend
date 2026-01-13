'use client';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  msg: string;
  state: 'success' | 'failure';
}

export default function InfoModal({ isOpen, onClose, title, msg, state }: InfoModalProps) {
  if (!isOpen) return null;

  const isSuccess = state === 'success';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <div className="flex flex-col items-center">
          <div className={`shrink-0 w-20 h-20 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
            {isSuccess ? (
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div className="m-4">
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6 text-center">
          <span className="font-semibold">{msg}</span>
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
