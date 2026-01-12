import type { Document } from '@/types/document';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/documents`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  
  const result = await response.json();
  return result.data;
}

export async function getDocumentsByParent(parentId: number): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/documents?parentId=${parentId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  
  const result = await response.json();
  return result.data;
}

export async function deleteDocument(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/documents/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
  return;
}

export async function getBinDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/documents/bin`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch bin documents');
  }
  
  const result = await response.json();
  return result.data;
}

export async function restoreDocument(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/documents/${id}/restore`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
  return;
}