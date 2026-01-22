'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Document } from '@/types/document';

interface FolderPathType {
  folderId: number | null;
  folderTitle: string;
}

interface DocumentContextType {
  docs: Document[];
  setDocs: (docs: Document[]) => void;
  currFolderId: number | null;
  setCurrFolderId: (id: number | null) => void;
  currFolderTitle: string;
  setCurrFolderTitle: (title: string) => void;
  folderPath: FolderPathType[];
  setFolderPath: (path: FolderPathType[]) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [docs, setDocs] = useState<Document[]>([]);
  const [currFolderId, setCurrFolderId] = useState<number | null>(null);
  const [currFolderTitle, setCurrFolderTitle] = useState<string>("Home");
  const [folderPath, setFolderPath] = useState<FolderPathType[]>([{folderId: null, folderTitle: "Home"}]);

  return (
    <DocumentContext.Provider value={{ 
      docs, 
      setDocs,
      currFolderId,
      setCurrFolderId,
      currFolderTitle,
      setCurrFolderTitle,
      folderPath,
      setFolderPath
    }}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within DocumentProvider');
  }
  return context;
}