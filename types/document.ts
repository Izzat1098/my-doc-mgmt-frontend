export interface Document {
  id: number;
  title: string;
  itemType: 'folder' | 'file';
  parentId: number | null;
  fileSizeKb: number | null;
  s3Url: string | null;
  createdBy: string | null;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
