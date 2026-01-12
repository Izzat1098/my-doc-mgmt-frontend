export interface Document {
  id: number;
  title: string;
  item_type: 'folder' | 'file';
  parentId: number | null;
  file_size_kb: number | null;
  s3_url: string | null;
  created_by: string | null;
  deleted_at: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
}
