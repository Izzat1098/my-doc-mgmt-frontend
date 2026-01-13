import type { Document } from '@/types/document';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Get root level items (no query params)
export async function getDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/documents`);

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  const result = await response.json();
  return result.data;
}

// Get items inside parentId (folder Id)
export async function getDocumentsByParent(
  parentId: number
): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/documents?parentId=${parentId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  const result = await response.json();
  return result.data;
}

// Get items based on title (using LIKE %title% in sql)
export async function getDocumentsByTitle(title: string): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/documents?title=${title}`);

  if (!response.ok) {
    return [];
  }

  const result = await response.json();
  return result.data;
}

// Delete item based on id
export async function deleteDocument(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/documents/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
  return;
}

// Get all deleted items
export async function getBinDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/documents/bin`);

  if (!response.ok) {
    throw new Error('Failed to fetch bin documents');
  }

  const result = await response.json();
  return result.data;
}

// Restore item by id
export async function restoreDocument(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/documents/${id}/restore`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
  return;
}

// Create a new folder at root or inside another folder
export async function createFolder(
  title: string,
  parentId?: number
): Promise<Document> {
  const response = await fetch(`${API_URL}/api/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      itemType: 'folder',
      parentId: parentId || null,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create folder');
  }

  const result = await response.json();
  return result.data;
}

// Create a file entry and get presigned upload URL
export async function createFile(
  title: string,
  fileSizeKb: number,
  parentId?: number
): Promise<{ document: Document; uploadUrl: string }> {
  const response = await fetch(`${API_URL}/api/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      itemType: 'file',
      fileSizeKb: fileSizeKb,
      parentId: parentId || null,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create file');
  }

  const result = await response.json();
  return {
    document: result.data,
    uploadUrl: result.uploadUrl,
  };
}
