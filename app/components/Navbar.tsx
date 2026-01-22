'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDocuments } from '@/lib/DocumentContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { docs, setDocs, currFolderId, setCurrFolderId, currFolderTitle, setCurrFolderTitle, folderPath, setFolderPath } = useDocuments();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoClick = () => {
    setCurrFolderId(null);
    setCurrFolderTitle("Home");
    setFolderPath([{folderId: null, folderTitle: "Home"}]);
    setIsOpen(false);
  };

  const handleBinClick = () => {
    setCurrFolderId(null);
    setCurrFolderTitle("Bin");
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className={`lg:hidden fixed top-3 left-4 z-50 p-2 bg-white rounded-md shadow-md hover:bg-gray-50 transition-opacity 
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-50 z-30"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-40
          w-64 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6">
          <div
            onClick={handleLogoClick}
            className="flex items-center justify-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src="/favicon.ico" alt="myDoc logo" className="w-8 h-8" />
            <h2 className="text-2xl font-bold text-gray-800">myDoc</h2>
          </div>

          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={handleLogoClick}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={handleBinClick}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Bin
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
